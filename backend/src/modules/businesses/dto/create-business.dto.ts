import { IsString, IsNotEmpty, IsOptional, IsArray, IsEmail, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBusinessDto {
  @ApiProperty({ example: 'Apollo Pharmacy & Wellness' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiPropertyOptional({ example: 'contact@apollopharmacy.in' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'https://apollopharmacy.in' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: 'Plot 12, Sector 18, Vashi, Navi Mumbai' })
  @IsString()
  @IsNotEmpty()
  addressLine: string;

  @ApiPropertyOptional({ example: 'mumbai' })
  @IsString()
  @IsOptional()
  citySlug?: string;

  @ApiPropertyOptional({ example: '400703' })
  @IsString()
  @IsOptional()
  pincode?: string;

  @ApiPropertyOptional({ example: 19.0771 })
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: 72.9986 })
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ example: ['Prescription Medicines', 'Health Supplements', 'Home Delivery'] })
  @IsArray()
  @IsOptional()
  services?: string[];

  @ApiPropertyOptional({ example: 'healthcare-clinics' })
  @IsString()
  @IsOptional()
  categorySlug?: string;

  @ApiPropertyOptional({ example: 'Authorized 24x7 Apollo branch offering genuine medicines.' })
  @IsString()
  @IsOptional()
  description?: string;
}

