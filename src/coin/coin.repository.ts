import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Coin } from './coin.model';

@Injectable()
export class CoinRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<Coin[]> {
    return this.prisma.coin.findMany({
      orderBy: {
        amount: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Coin | null> {
    return this.prisma.coin.findFirst({ where: { id } });
  }

  async createOne(data: {
    id: string;
    name: string;
    price: bigint;
    minPrice: bigint;
    maxPrice: bigint;
    amount: bigint;
  }): Promise<void> {
    await this.prisma.coin.create({ data });
  }

  async updateOne(
    id: string,
    data: {
      name?: string;
      price?: bigint;
      minPrice?: bigint;
      maxPrice?: bigint;
      amount?: bigint;
    },
  ) {
    await this.prisma.coin.update({
      where: { id },
      data,
    });
  }
}
