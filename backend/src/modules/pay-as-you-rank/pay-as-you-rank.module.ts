import { Module } from '@nestjs/common';
import { PayAsYouRankController } from './pay-as-you-rank.controller';
import { PayAsYouRankService } from './pay-as-you-rank.service';

@Module({
  controllers: [PayAsYouRankController],
  providers: [PayAsYouRankService],
  exports: [PayAsYouRankService],
})
export class PayAsYouRankModule {}

