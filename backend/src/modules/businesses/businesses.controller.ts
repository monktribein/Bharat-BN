import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@ApiTags('businesses')
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get()
  @ApiOperation({ summary: 'Search and filter business directory listings' })
  @ApiQuery({ name: 'q', required: false, description: 'Search term or keywords' })
  @ApiQuery({ name: 'category', required: false, description: 'Category slug' })
  @ApiQuery({ name: 'city', required: false, description: 'City slug' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.businessesService.findAll({ q, category, city, page, limit });
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get business listing details by ID or canonical slug' })
  findByIdOrSlug(@Param('idOrSlug') idOrSlug: string) {
    return this.businessesService.findByIdOrSlug(idOrSlug);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new business listing entity' })
  @ApiResponse({ status: 201, description: 'Business created successfully' })
  create(@Body() dto: CreateBusinessDto) {
    return this.businessesService.create(dto);
  }
}

