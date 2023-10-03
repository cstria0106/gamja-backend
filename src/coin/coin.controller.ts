import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { BadRequestException, Controller } from '@nestjs/common';

import { Roles } from '../authorization/roles.decorator';
import { bigint } from '../utils/bigint';
import { CoinService } from './coin.service';

export module GetPriceHistories {
  export type Query = {
    from?: string;
    to?: string;
  };

  export type Response = {
    histories: {
      price: string;
      timestamp: Date;
    }[];
  };
}

export type GetCoinsResponse = {
  coins: {
    id: string;
    name: string;
    price: string;
    amount: string;
  }[];
};

export type ManageCreateCoinBody = {
  id: string;
  name: string;
  minPrice: string;
  maxPrice: string;
  price: string;
  amount: string;
};

@Controller('coin')
export class CoinController {
  constructor(private readonly coin: CoinService) {}

  @TypedRoute.Get()
  async getCoins(): Promise<GetCoinsResponse> {
    const coins = await this.coin.getAll();
    return {
      coins: coins.map((coin) => ({
        ...coin,
        price: coin.price.toString(),
        amount: coin.amount.toString(),
      })),
    };
  }

  @TypedRoute.Get(':id/price-histories')
  async getPriceHistories(
    @TypedParam('id') coinId: string,
    @TypedQuery() query: GetPriceHistories.Query,
  ): Promise<GetPriceHistories.Response> {
    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;
    // Check if from is a valid date
    if (from && isNaN(from.getTime())) {
      throw new BadRequestException('Invalid from');
    }

    // Check if to is a valid date
    if (to && isNaN(to.getTime())) {
      throw new BadRequestException('Invalid to');
    }

    return {
      histories: await this.coin
        .getPriceHistories(coinId, { from: from, to: to })
        .then((histories) =>
          histories.map((history) => ({
            ...history,
            price: history.price.toString(),
          })),
        ),
    };
  }

  @TypedRoute.Post()
  @Roles(['ADMIN'])
  async manageCreateCoin(
    @TypedBody() body: ManageCreateCoinBody,
  ): Promise<void> {
    await this.coin.create({
      ...body,
      minPrice: bigint(body.minPrice),
      maxPrice: bigint(body.maxPrice),
      price: bigint(body.price),
      amount: bigint(body.amount),
    });
  }
}
