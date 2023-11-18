import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UserCoin } from './user-coin.model';
import { User } from './user.model';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async findOneWithCoins(
    id: string,
  ): Promise<(User & { coins: UserCoin[] }) | null> {
    return this.prisma.user.findFirst({
      where: { id },
      include: { coins: true },
    });
  }

  async findMany(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createOne(
    data: Pick<User, 'id' | 'password' | 'salt' | 'name' | 'balance'>,
  ): Promise<void> {
    await this.prisma.user.create({
      data,
    });
  }

  async updateOne(
    id: string,
    data: {
      balance?: bigint;
    },
  ) {
    await this.prisma.user.update({
      where: { id },
      data: {
        balance: data.balance,
      },
    });
  }
}
