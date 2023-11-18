import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, Query } from '@nestjs/common';

import { Payload } from '../authorization/auth';
import { Role } from '../authorization/roles';
import { Roles } from '../authorization/roles.decorator';
import { Auth } from '../authorization/user.decorator';
import { bigint } from '../utils/bigint';
import { UserService } from './user.service';

export type GetMyUserResponse = {
  user: {
    id: string;
    balance: string;
    name: string;
  };
};

export type RegisterBody = {
  id: string;
  name: string;
  password: string;
};

export type GetMyBalanceHistoriesResponse = {
  balanceHistories: {
    amount: string;
    reason: string | null;
    createdAt: Date;
  }[];
};

export type GetMyBalanceHistoriesQuery = {
  skip?: number;
};

export type GetMyCoinsResponse = {
  coins: {
    id: string;
    name: string;
    amount: string;
    lastPrice: string;
  }[];
};

export module ManageGetUserCoins {
  export type Response = {
    coins: {
      id: string;
      name: string;
      amount: string;
      lastPrice: string;
    }[];
  };
}

export module ManageGetUsers {
  export type Response = {
    users: {
      id: string;
      name: string;
      balance: string;
      role: Role;
    }[];
  };
}

export module ManageConsumeUserCoins {
  export type Body = {
    coins: { id: string; amount: string }[];
  };
}

@Controller('user')
export class UserController {
  constructor(private readonly user: UserService) {}

  @TypedRoute.Get('me')
  @Roles(['USER'])
  async getMyUser(@Auth() user: Payload): Promise<GetMyUserResponse> {
    return this.user.getOwned(user.id).then((user) => ({
      user: { ...user, balance: user.balance.toString() },
    }));
  }

  @TypedRoute.Post()
  async register(@TypedBody() body: RegisterBody): Promise<void> {
    await this.user.create({
      id: body.id,
      name: body.name,
      plainPassword: body.password,
    });
  }

  @Roles(['USER'])
  @TypedRoute.Get('me/balance-histories')
  async getMyBalanceHistories(
    @Auth() user: Payload,
    @TypedQuery() query: GetMyBalanceHistoriesQuery,
  ): Promise<GetMyBalanceHistoriesResponse> {
    return this.user
      .getOwnedBalanceHistories(user.id, query.skip ?? 0)
      .then((balanceHistories) => ({
        balanceHistories: balanceHistories.map((balanceHistory) => ({
          ...balanceHistory,
          amount: balanceHistory.amount.toString(),
        })),
      }));
  }

  @Roles(['USER'])
  @TypedRoute.Get('me/coins')
  async getMyCoins(@Auth() user: Payload): Promise<GetMyCoinsResponse> {
    return this.user.getOwnedCoins(user.id).then((coins) => ({
      coins: coins.map((coin) => ({
        ...coin,
        amount: coin.amount.toString(),
        lastPrice: coin.lastPrice.toString(),
      })),
    }));
  }

  @Roles(['ADMIN'])
  @TypedRoute.Get(':id/coins')
  async manageGetUserCoins(
    @TypedParam('id') id: string,
  ): Promise<ManageGetUserCoins.Response> {
    return this.user.getOwnedCoins(id).then((coins) => ({
      coins: coins.map((coin) => ({
        ...coin,
        amount: coin.amount.toString(),
        lastPrice: coin.lastPrice.toString(),
      })),
    }));
  }

  @Roles(['ADMIN'])
  @TypedRoute.Delete(':id/coins')
  async manageConsumeUserCoins(
    @TypedParam('id') userId: string,
    @TypedBody() body: ManageConsumeUserCoins.Body,
  ): Promise<void> {
    await this.user.consumeCoinsBatch(
      userId,
      body.coins.map((coin) => ({
        id: coin.id,
        amount: bigint(coin.amount),
      })),
    );
  }

  @Roles(['ADMIN'])
  @TypedRoute.Get()
  async manageGetUsers(): Promise<ManageGetUsers.Response> {
    return this.user.manageGetAll().then((users) => ({
      users: users.map((user) => ({
        ...user,
        balance: user.balance.toString(),
      })),
    }));
  }
}
