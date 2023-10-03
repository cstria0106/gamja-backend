import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BalanceHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(userId: string, skip?: number) {
    return this.prisma.balanceHistory.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
      skip,
    });
  }
}
