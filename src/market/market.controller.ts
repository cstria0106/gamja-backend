import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';

import { Payload } from '../authorization/auth';
import { Roles } from '../authorization/roles.decorator';
import { Auth } from '../authorization/user.decorator';
import { bigint } from '../utils/bigint';
import { MarketService } from './market.service';

export module Buy {
  export type Body = {
    amount: string;
    price: string;
  };
}

export module Sell {
  export type Body = {
    amount: string;
    price: string;
  };
}

@Controller('market')
export class MarketController {
  constructor(private readonly market: MarketService) {}

  @Roles(['USER'])
  @TypedRoute.Post('coin/:id/buy')
  async buy(
    @Auth() user: Payload,
    @TypedParam('id') coinId: string,
    @TypedBody() body: Buy.Body,
  ): Promise<void> {
    await this.market.buy(
      user.id,
      coinId,
      bigint(body.amount),
      bigint(body.price),
    );
  }

  @Roles(['USER'])
  @TypedRoute.Post('coin/:id/sell')
  async sell(
    @Auth() user: Payload,
    @TypedParam('id') coinId: string,
    @TypedBody() body: Sell.Body,
  ): Promise<void> {
    await this.market.sell(
      user.id,
      coinId,
      bigint(body.amount),
      bigint(body.price),
    );
  }
}
