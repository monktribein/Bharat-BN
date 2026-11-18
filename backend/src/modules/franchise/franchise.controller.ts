import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FranchiseService } from './franchise.service';

@ApiTags('franchise')
@Controller('brands')
export class FranchiseController {
  constructor(private readonly franchiseService: FranchiseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new franchise brand HQ' })
  createBrand(@Body() body: { name: string; website?: string; logoUrl?: string }) {
    return this.franchiseService.createBrand(body);
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get brand details and outlet summary' })
  getBrand(@Param('idOrSlug') idOrSlug: string) {
    return this.franchiseService.getBrand(idOrSlug);
  }

  @Get(':id/branches')
  @ApiOperation({ summary: 'List all branches under a franchise brand' })
  getBranches(@Param('id') id: string) {
    return this.franchiseService.getBranches(id);
  }

  @Post(':id/branches/import')
  @ApiOperation({ summary: 'Bulk import branches with idempotency and duplicate preview' })
  bulkImport(
    @Param('id') id: string,
    @Body() body: { branches: Array<{ outletName: string; outletCode: string; city: string; phone: string; managerEmail?: string }> },
  ) {
    return this.franchiseService.bulkImportBranches(id, body.branches || []);
  }
}

