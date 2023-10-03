import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CoinPriceHistory } from './coin-price-history.model';

@Injectable()
export class CoinPriceHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    criteria?: CoinPriceHistory.Criteria,
  ): Promise<CoinPriceHistory[]> {
    return this.prisma.coinPriceHistory.findMany({
      where: {
        coinId: criteria?.coinId,
        timestamp: (criteria?.from || criteria?.to) && {
          gte: criteria.from,
          lte: criteria.to,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async createOne(data: {
    coinId: string;
    price: bigint;
    timestamp: Date;
  }): Promise<void> {
    await this.prisma.coinPriceHistory.create({ data });
  }
}
