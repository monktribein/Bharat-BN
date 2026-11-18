import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

export interface SeoCampaign {
  id: string;
  businessId: string;
  keyword: string;
  targetUrl: string;
  cityName: string;
  device: 'mobile' | 'desktop';
  baselinePosition?: number;
  currentPosition?: number;
  status: 'pending_advance' | 'active' | 'completed';
  createdAt: string;
}

export interface RankCheck {
  id: string;
  campaignId: string;
  position: number;
  observedUrl: string;
  provider: string;
  checkedAt: string;
}

export interface Milestone {
  id: string;
  campaignId: string;
  type: 'advance_25' | 'top_20' | 'top_10';
  percentage: number;
  amount: number;
  status: 'locked' | 'eligible' | 'verified' | 'invoiced' | 'paid';
  qualifyingObservations: RankCheck[];
  verifiedAt?: string;
  verifiedBy?: string;
}

@Injectable()
export class PayAsYouRankService {
  private campaigns: SeoCampaign[] = [
    {
      id: 'camp-001',
      businessId: '55555555-5555-5555-5555-555555555001',
      keyword: 'best dental clinic in andheri west',
      targetUrl: 'https://bharatbn.com/mumbai/healthcare-clinics/apex-super-speciality-dental-clinic-andheri-mumbai',
      cityName: 'Mumbai',
      device: 'mobile',
      baselinePosition: 48,
      currentPosition: 8,
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ];

  private rankChecks: RankCheck[] = [
    {
      id: 'rc-01',
      campaignId: 'camp-001',
      position: 8,
      observedUrl: 'https://bharatbn.com/mumbai/healthcare-clinics/apex-super-speciality-dental-clinic-andheri-mumbai',
      provider: 'dataforseo',
      checkedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 36 hours ago
    },
    {
      id: 'rc-02',
      campaignId: 'camp-001',
      position: 7,
      observedUrl: 'https://bharatbn.com/mumbai/healthcare-clinics/apex-super-speciality-dental-clinic-andheri-mumbai',
      provider: 'dataforseo',
      checkedAt: new Date().toISOString(), // Now
    },
  ];

  private milestones: Milestone[] = [
    {
      id: 'ms-01',
      campaignId: 'camp-001',
      type: 'advance_25',
      percentage: 25,
      amount: 5000,
      status: 'paid',
      qualifyingObservations: [],
      verifiedAt: new Date().toISOString(),
    },
    {
      id: 'ms-02',
      campaignId: 'camp-001',
      type: 'top_20',
      percentage: 25,
      amount: 5000,
      status: 'paid',
      qualifyingObservations: [],
      verifiedAt: new Date().toISOString(),
    },
    {
      id: 'ms-03',
      campaignId: 'camp-001',
      type: 'top_10',
      percentage: 50,
      amount: 10000,
      status: 'eligible', // 2 observations < 10 confirmed 36h apart
      qualifyingObservations: [],
    },
  ];

  createCampaign(data: {
    businessId: string;
    keyword: string;
    targetUrl: string;
    cityName: string;
    device?: 'mobile' | 'desktop';
    totalContractValue: number;
  }) {
    const campaignId = crypto.randomUUID();
    const campaign: SeoCampaign = {
      id: campaignId,
      businessId: data.businessId,
      keyword: data.keyword,
      targetUrl: data.targetUrl,
      cityName: data.cityName,
      device: data.device || 'mobile',
      status: 'pending_advance',
      createdAt: new Date().toISOString(),
    };
    this.campaigns.push(campaign);

    // Create 3 milestones: 25% advance, 25% top-20, 50% top-10
    const total = data.totalContractValue || 20000;
    this.milestones.push(
      {
        id: crypto.randomUUID(),
        campaignId,
        type: 'advance_25',
        percentage: 25,
        amount: total * 0.25,
        status: 'eligible',
        qualifyingObservations: [],
      },
      {
        id: crypto.randomUUID(),
        campaignId,
        type: 'top_20',
        percentage: 25,
        amount: total * 0.25,
        status: 'locked',
        qualifyingObservations: [],
      },
      {
        id: crypto.randomUUID(),
        campaignId,
        type: 'top_10',
        percentage: 50,
        amount: total * 0.5,
        status: 'locked',
        qualifyingObservations: [],
      },
    );

    return { campaign, milestones: this.milestones.filter((m) => m.campaignId === campaignId) };
  }

  recordRankObservation(campaignId: string, position: number, observedUrl: string, provider: string) {
    const campaign = this.campaigns.find((c) => c.id === campaignId);
    if (!campaign) throw new NotFoundException('Campaign not found');

    const observation: RankCheck = {
      id: crypto.randomUUID(),
      campaignId,
      position,
      observedUrl,
      provider,
      checkedAt: new Date().toISOString(),
    };
    this.rankChecks.unshift(observation);
    campaign.currentPosition = position;

    // Evaluate Milestone eligibility with Dual-Proof requirement (2 checks >=24h apart)
    this.evaluateMilestones(campaignId);

    return observation;
  }

  private evaluateMilestones(campaignId: string) {
    const checks = this.rankChecks.filter((r) => r.campaignId === campaignId);
    if (checks.length < 2) return;

    const top10Checks = checks.filter((c) => c.position <= 10);
    if (top10Checks.length >= 2) {
      const timeDiffHours =
        (new Date(top10Checks[0].checkedAt).getTime() - new Date(top10Checks[1].checkedAt).getTime()) /
        (1000 * 3600);

      // Must be >= 24h apart
      if (Math.abs(timeDiffHours) >= 24) {
        const top10Milestone = this.milestones.find(
          (m) => m.campaignId === campaignId && m.type === 'top_10',
        );
        if (top10Milestone && top10Milestone.status === 'locked') {
          top10Milestone.status = 'eligible';
          top10Milestone.qualifyingObservations = [top10Checks[0], top10Checks[1]];
        }
      }
    }
  }

  verifyMilestone(milestoneId: string, managerId: string = 'seo-manager-01') {
    const milestone = this.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new NotFoundException('Milestone not found');

    if (milestone.status !== 'eligible') {
      throw new BadRequestException('Milestone is not eligible for verification yet.');
    }

    milestone.status = 'verified';
    milestone.verifiedBy = managerId;
    milestone.verifiedAt = new Date().toISOString();

    return {
      success: true,
      milestone,
      nextStep: 'Invoice generation ready for billing module',
    };
  }

  getCampaignSummary(campaignId: string) {
    const campaign = this.campaigns.find((c) => c.id === campaignId);
    if (!campaign) throw new NotFoundException('Campaign not found');

    return {
      campaign,
      milestones: this.milestones.filter((m) => m.campaignId === campaignId),
      recentObservations: this.rankChecks.filter((r) => r.campaignId === campaignId).slice(0, 10),
    };
  }
}

