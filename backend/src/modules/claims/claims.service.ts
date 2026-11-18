import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SubmitClaimDto, DecideClaimDto } from './dto/submit-claim.dto';
import * as crypto from 'crypto';

export interface ClaimRecord {
  id: string;
  businessId: string;
  claimantName: string;
  workEmail: string;
  phone: string;
  evidenceType: string;
  evidenceDocUrl: string;
  notes?: string;
  reviewStatus: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

@Injectable()
export class ClaimsService {
  private claims: ClaimRecord[] = [
    {
      id: 'claim-1001',
      businessId: '55555555-5555-5555-5555-555555555002',
      claimantName: 'Sunita Rao',
      workEmail: 'director@littleellyindiranagar.com',
      phone: '+919845012345',
      evidenceType: 'gst_certificate',
      evidenceDocUrl: 'https://storage.bharatbn.com/claims/gst-proof.pdf',
      notes: 'Preschool founder center director.',
      reviewStatus: 'pending',
      createdAt: new Date().toISOString(),
    },
  ];

  submitClaim(dto: SubmitClaimDto): ClaimRecord {
    const existing = this.claims.find(
      (c) => c.businessId === dto.businessId && c.reviewStatus === 'pending',
    );
    if (existing) {
      throw new BadRequestException('A claim request for this business is already under review.');
    }

    const claim: ClaimRecord = {
      id: crypto.randomUUID(),
      ...dto,
      reviewStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.claims.unshift(claim);
    return claim;
  }

  findAll(status?: 'pending' | 'approved' | 'rejected'): ClaimRecord[] {
    if (status) {
      return this.claims.filter((c) => c.reviewStatus === status);
    }
    return this.claims;
  }

  decideClaim(id: string, dto: DecideClaimDto, reviewerId: string = 'admin-user'): ClaimRecord {
    const claim = this.claims.find((c) => c.id === id);
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found.`);
    }

    claim.reviewStatus = dto.decision;
    claim.reviewedBy = reviewerId;
    claim.reviewedAt = new Date().toISOString();
    if (dto.reason) {
      claim.rejectionReason = dto.reason;
    }

    return claim;
  }
}

