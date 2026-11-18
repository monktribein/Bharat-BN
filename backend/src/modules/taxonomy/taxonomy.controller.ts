import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TaxonomyService } from './taxonomy.service';

@ApiTags('taxonomy')
@Controller()
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get category taxonomy tree' })
  getCategories() {
    return this.taxonomyService.getCategories();
  }

  @Get('locations')
  @ApiOperation({ summary: 'Get geographic locations hierarchy' })
  getLocations() {
    return this.taxonomyService.getLocations();
  }
}

