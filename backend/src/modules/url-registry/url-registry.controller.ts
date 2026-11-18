import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UrlRegistryService, UrlRegistryRecord } from './url-registry.service';

@ApiTags('url-registry')
@Controller('url-registry')
export class UrlRegistryController {
  constructor(private readonly urlRegistryService: UrlRegistryService) {}

  @Get('resolve')
  @ApiOperation({ summary: 'Resolve ownership (WordPress vs Next.js) for an incoming request path' })
  @ApiResponse({ status: 200, description: 'Resolved routing details' })
  resolve(@Query('path') path: string): UrlRegistryRecord {
    return this.urlRegistryService.resolvePath(path || '/');
  }

  @Post('register')
  @ApiOperation({ summary: 'Register or update a path in the hybrid URL ownership registry' })
  register(@Body() body: UrlRegistryRecord): UrlRegistryRecord {
    return this.urlRegistryService.registerUrl(body);
  }
}

