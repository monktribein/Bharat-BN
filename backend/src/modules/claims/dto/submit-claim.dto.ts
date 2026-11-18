import { IsString, IsNotEmpty, IsEmail, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitClaimDto {
  @ApiProperty({ example: '55555555-5555-5555-5555-555555555002' })
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @ApiProperty({ example: 'Sunita Rao' })
  @IsString()
  @IsNotEmpty()
  claimantName: string;

  @ApiProperty({ example: 'director@littleellyindiranagar.com' })
  @IsEmail()
  @IsNotEmpty()
  workEmail: string;

  @ApiProperty({ example: '+919845012345' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'gst_certificate',
    enum: ['gst_certificate', 'utility_bill', 'official_id', 'domain_email'],
  })
  @IsIn(['gst_certificate', 'utility_bill', 'official_id', 'domain_email'])
  evidenceType: string;

  @ApiProperty({ example: 'https://storage.bharatbn.com/claims/proof-001.pdf' })
  @IsString()
  @IsNotEmpty()
  evidenceDocUrl: string;

  @ApiPropertyOptional({ example: 'I am the founding center head of this preschool branch.' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class DecideClaimDto {
  @ApiProperty({ enum: ['approved', 'rejected'] })
  @IsIn(['approved', 'rejected'])
  decision: 'approved' | 'rejected';

  @ApiPropertyOptional({ example: 'GST certificate matched government records.' })
  @IsString()
  @IsOptional()
  reason?: string;
}

