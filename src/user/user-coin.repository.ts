import { Injectable } from '@nestjs/common';

import { Coin } from '../coin/coin.model';
import { PrismaService } from '../prisma/prisma.service';
import { UserCoin } from './user-coin.model';

@Injectable()
export class UserCoinRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(userId: string): Promise<(UserCoin & { coin: Coin })[]> {
    return this.prisma.userCoin.findMany({
      where: { userId },
      include: { coin: true },
    });
  }

  async findOne(userId: string, coinId: string): Promise<UserCoin | null> {
    return this.prisma.userCoin.findFirst({ where: { userId, coinId } });
  }

  async createOne(
    userId: string,
    coinId: string,
    amount: bigint,
    price: bigint,
  ): Promise<void> {
    await this.prisma.userCoin.create({
      data: { userId, coinId, amount, lastPrice: price },
    });
  }

  async updateOne(
    userId: string,
    coinId: string,
    amount: bigint,
    price?: bigint,
  ): Promise<void> {
    await this.prisma.userCoin.update({
      where: { userId_coinId: { userId, coinId } },
      data: {
        amount,
        lastPrice: price,
      },
    });
  }
}
