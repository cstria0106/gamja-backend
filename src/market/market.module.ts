import { Module } from '@nestjs/common';

import { CoinModule } from '../coin/coin.module';
import { UserModule } from '../user/user.module';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

@Module({
  imports: [CoinModule, UserModule],
  providers: [MarketService],
  controllers: [MarketController],
})
export class MarketModule {}
