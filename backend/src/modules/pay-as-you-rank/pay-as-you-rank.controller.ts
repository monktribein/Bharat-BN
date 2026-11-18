import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PayAsYouRankService } from './pay-as-you-rank.service';

@ApiTags('pay-as-you-rank')
@Controller('campaigns')
export class PayAsYouRankController {
  constructor(private readonly payAsYouRankService: PayAsYouRankService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Pay-As-You-Rank™ campaign with 3 milestone contracts' })
  createCampaign(
    @Body()
    body: {
      businessId: string;
      keyword: string;
      targetUrl: string;
      cityName: string;
      device?: 'mobile' | 'desktop';
      totalContractValue: number;
    },
  ) {
    return this.payAsYouRankService.createCampaign(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign status, ranking evidence, and milestones' })
  getCampaign(@Param('id') id: string) {
    return this.payAsYouRankService.getCampaignSummary(id);
  }

  @Post(':id/rankings')
  @ApiOperation({ summary: 'Ingest SERP provider rank check observation' })
  recordRanking(
    @Param('id') id: string,
    @Body() body: { position: number; observedUrl: string; provider: string },
  ) {
    return this.payAsYouRankService.recordRankObservation(
      id,
      body.position,
      body.observedUrl,
      body.provider,
    );
  }

  @Post('milestones/:milestoneId/verify')
  @ApiOperation({ summary: 'Manager approval of ranking milestone evidence' })
  verifyMilestone(@Param('milestoneId') milestoneId: string) {
    return this.payAsYouRankService.verifyMilestone(milestoneId);
  }
}

