import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment';

import { bigint } from '../utils/bigint';
import { required } from '../utils/required';
import { CoinPriceHistory } from './coin-price-history.model';
import { CoinPriceHistoryRepository } from './coin-price-history.repository';
import { Coin } from './coin.model';
import { CoinRepository } from './coin.repository';

@Injectable()
export class CoinService {
  constructor(
    private readonly coins: CoinRepository,
    private readonly coinPriceHistories: CoinPriceHistoryRepository,
  ) {}

  async getAll(): Promise<Coin.View.Default[]> {
    return this.coins.findMany();
  }

  async getPriceHistories(
    coinId: string,
    options?: { from?: Date; to?: Date },
  ): Promise<CoinPriceHistory.View.Default[]> {
    return this.coinPriceHistories.findMany({
      coinId,
      from: options?.from,
      to: options?.to,
    });
  }

  async create(data: Coin.Input.Create): Promise<void> {
    const existing = await this.coins.findOne(data.id);
    if (existing !== null) {
      throw new BadRequestException('Coin already exists');
    }
    await this.coins.createOne(data);
  }

  async updatePrice(coinId: string): Promise<void> {
    const coin = await this.coins.findOne(coinId).then(required('coin'));

    const now = moment().startOf('minute');

    let positive = Math.random() <= 0.5;
    let delta = positive
      ? bigint.min(
          coin.maxPrice - coin.price,
          bigint(Math.floor(Math.random() * 100)),
        )
      : bigint.max(
          coin.minPrice - coin.price,
          -bigint(Math.floor(Math.random() * 100)),
        );
    const newPrice = coin.price + delta;

    await this.coins.updateOne(coinId, {
      price: newPrice,
    });

    await this.coinPriceHistories.createOne({
      coinId,
      price: newPrice,
      timestamp: now.toDate(),
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateAllPrice(): Promise<void> {
    const coins = await this.coins.findMany();
    await Promise.all(coins.map((coin) => this.updatePrice(coin.id)));
  }
}
