import { Module } from '@nestjs/common';
import { UrlRegistryController } from './url-registry.controller';
import { UrlRegistryService } from './url-registry.service';

@Module({
  controllers: [UrlRegistryController],
  providers: [UrlRegistryService],
  exports: [UrlRegistryService],
})
export class UrlRegistryModule {}

