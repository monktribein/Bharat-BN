import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeadsService } from './leads.service';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit an inquiry form with explicit consent & UTM attribution' })
  submitLead(
    @Body()
    body: {
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
    },
  ) {
    return this.leadsService.submitLead(body);
  }

  @Post('interactions')
  @ApiOperation({ summary: 'Track click-to-call and WhatsApp click events separately from verified leads' })
  recordInteraction(
    @Body() body: { businessId: string; eventType: 'click_to_call' | 'click_to_whatsapp' | 'share' },
  ) {
    return this.leadsService.recordInteraction(body.businessId, body.eventType);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'Get leads and conversion metrics for a business' })
  getLeadsForBusiness(@Param('businessId') businessId: string) {
    return this.leadsService.getLeadsForBusiness(businessId);
  }
}

