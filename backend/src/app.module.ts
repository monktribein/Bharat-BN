import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlRegistryModule } from './modules/url-registry/url-registry.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { TaxonomyModule } from './modules/taxonomy/taxonomy.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { FranchiseModule } from './modules/franchise/franchise.module';
import { LeadsModule } from './modules/leads/leads.module';
import { PayAsYouRankModule } from './modules/pay-as-you-rank/pay-as-you-rank.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UrlRegistryModule,
    BusinessesModule,
    TaxonomyModule,
    ClaimsModule,
    FranchiseModule,
    LeadsModule,
    PayAsYouRankModule,
  ],
})
export class AppModule {}

