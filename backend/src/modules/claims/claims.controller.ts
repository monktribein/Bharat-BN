import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ClaimsService } from './claims.service';
import { SubmitClaimDto, DecideClaimDto } from './dto/submit-claim.dto';

@ApiTags('claims')
@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a business claim with evidence' })
  @ApiResponse({ status: 201, description: 'Claim submitted successfully and placed in review queue' })
  submit(@Body() dto: SubmitClaimDto) {
    return this.claimsService.submitClaim(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List claim requests (Admin moderation queue)' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'approved', 'rejected'] })
  findAll(@Query('status') status?: 'pending' | 'approved' | 'rejected') {
    return this.claimsService.findAll(status);
  }

  @Post(':id/decision')
  @ApiOperation({ summary: 'Reviewer decision (Approve or Reject a claim)' })
  decide(@Param('id') id: string, @Body() dto: DecideClaimDto) {
    return this.claimsService.decideClaim(id, dto);
  }
}

