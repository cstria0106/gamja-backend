import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import _ from 'lodash';

import { CoinRepository } from '../coin/coin.repository';
import { UserService } from '../user/user.service';
import { required } from '../utils/required';

@Injectable()
export class MarketService {
  constructor(
    private readonly coins: CoinRepository,
    private readonly user: UserService,
  ) {}

  async sell(
    sellerId: string,
    coinId: string,
    amount: bigint,
    price: bigint,
  ): Promise<void> {
    const coin = await this.coins.findOne(coinId).then(required('coin'));
    if (coin.price !== price) {
      throw new BadRequestException('Invalid price');
    }
    // Increase coin amount
    await this.coins.updateOne(coin.id, { amount: coin.amount + amount });
    try {
      // Seller pays coins
      await this.user.consumeCoins(sellerId, coin.id, amount);

      try {
        // Give seller money
        await this.user.giveMoney(sellerId, price * amount);
      } catch (e) {
        // Restore seller coins
        await this.user.giveCoins(sellerId, coinId, amount - amount, price);
        throw e;
      }
    } catch (e) {
      // Restore coin amount
      await this.coins.updateOne(coin.id, { amount: coin.amount });
      throw e;
    }
  }

  async buy(buyerId: string, coinId: string, amount: bigint, price: bigint) {
    const coin = await this.coins.findOne(coinId).then(required('coin'));
    if (coin.price !== price) {
      throw new BadRequestException('Invalid price');
    }
    if (coin.amount < amount) {
      throw new BadRequestException('Not enough coins');
    }
    // Decrease coin amount
    await this.coins.updateOne(coin.id, { amount: coin.amount - amount });
    try {
      // Buyer pays money
      await this.user.consumeMoney(buyerId, price * amount);
      try {
        // Give coins to buyer
        await this.user.giveCoins(buyerId, coinId, amount, price);
      } catch (e) {
        // Restore coins
        await this.user.giveMoney(buyerId, price * amount);
        throw e;
      }
    } catch (e) {
      // Restore coins
      await this.coins.updateOne(coin.id, { amount: coin.amount });
      throw e;
    }
  }
}
