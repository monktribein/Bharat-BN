import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

export interface LeadEntity {
  id: string;
  businessId: string;
  branchId?: string;
  inquirerName: string;
  inquirerPhone: string;
  inquirerEmail?: string;
  message?: string;
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  consentGiven: boolean;
  consentAt: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  createdAt: string;
}

export interface InteractionEvent {
  id: string;
  businessId: string;
  eventType: 'click_to_call' | 'click_to_whatsapp' | 'share';
  createdAt: string;
}

@Injectable()
export class LeadsService {
  private leads: LeadEntity[] = [];
  private interactions: InteractionEvent[] = [];

  submitLead(data: {
    businessId: string;
    branchId?: string;
    inquirerName: string;
    inquirerPhone: string;
    inquirerEmail?: string;
    message?: string;
    sourceUrl?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    consentGiven: boolean;
  }): LeadEntity {
    if (!data.consentGiven) {
      throw new BadRequestException('Explicit consent is required to submit an inquiry.');
    }

    const lead: LeadEntity = {
      id: crypto.randomUUID(),
      businessId: data.businessId,
      branchId: data.branchId,
      inquirerName: data.inquirerName,
      inquirerPhone: data.inquirerPhone,
      inquirerEmail: data.inquirerEmail,
      message: data.message,
      sourceUrl: data.sourceUrl,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      consentGiven: true,
      consentAt: new Date().toISOString(),
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    this.leads.unshift(lead);
    console.log(`[Lead Automation] Queued transactional WhatsApp notification for lead ${lead.id}`);
    return lead;
  }

  recordInteraction(businessId: string, eventType: 'click_to_call' | 'click_to_whatsapp' | 'share') {
    const event: InteractionEvent = {
      id: crypto.randomUUID(),
      businessId,
      eventType,
      createdAt: new Date().toISOString(),
    };
    this.interactions.push(event);
    return { success: true, eventId: event.id };
  }

  getLeadsForBusiness(businessId: string) {
    const businessLeads = this.leads.filter((l) => l.businessId === businessId);
    const callClicks = this.interactions.filter(
      (i) => i.businessId === businessId && i.eventType === 'click_to_call',
    ).length;
    const whatsappClicks = this.interactions.filter(
      (i) => i.businessId === businessId && i.eventType === 'click_to_whatsapp',
    ).length;

    return {
      leads: businessLeads,
      metrics: {
        totalVerifiedLeads: businessLeads.length,
        totalClickToCall: callClicks,
        totalClickToWhatsApp: whatsappClicks,
      },
    };
  }
}

