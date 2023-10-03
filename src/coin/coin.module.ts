import { Module } from '@nestjs/common';

import { CoinPriceHistoryRepository } from './coin-price-history.repository';
import { CoinController } from './coin.controller';
import { CoinRepository } from './coin.repository';
import { CoinService } from './coin.service';

@Module({
  providers: [CoinService, CoinRepository, CoinPriceHistoryRepository],
  controllers: [CoinController],
  exports: [CoinRepository, CoinPriceHistoryRepository],
})
export class CoinModule {}
