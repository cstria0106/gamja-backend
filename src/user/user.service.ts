import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

import { Coin } from '../coin/coin.model';
import { CryptoService } from '../crypto/crypto.service';
import { required } from '../utils/required';
import { BalanceHistory } from './balance-history.model';
import { BalanceHistoryRepository } from './balance-history.repository';
import { UserCoinRepository } from './user-coin.repository';
import { User } from './user.model';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly users: UserRepository,
    private readonly userCoins: UserCoinRepository,
    private readonly balanceHistories: BalanceHistoryRepository,
    private readonly crypto: CryptoService,
  ) {}

  async get(id: string): Promise<User.View.Default> {
    return this.users.findOne(id).then(required('user'));
  }

  async manageGetAll(): Promise<User.View.Manage[]> {
    return this.users.findMany();
  }

  async getOwned(id: string): Promise<User.View.Owned> {
    return this.users.findOne(id).then(required('user'));
  }

  async create({
    id,
    name,
    plainPassword,
  }: {
    id: string;
    name: string;
    plainPassword: string;
  }): Promise<void> {
    const existingUser = await this.users.findOne(id);
    if (existingUser !== null)
      throw new BadRequestException('User already exists');

    const [password, salt] = await this.crypto.encrypt(plainPassword);
    await this.users.createOne({
      id,
      name,
      password: password.toString('base64'),
      salt: salt.toString('base64'),
      balance: BigInt(5000), // TODO: Change amount
    });
  }

  async getOwnedBalanceHistories(
    userId: string,
    skip?: number,
  ): Promise<BalanceHistory.View.Owned[]> {
    return this.balanceHistories.findMany(userId, skip);
  }

  async getOwnedCoins(
    userId: string,
  ): Promise<
    { id: string; name: string; amount: bigint; lastPrice: bigint }[]
  > {
    return this.userCoins.findMany(userId).then((userCoins) =>
      userCoins.map((userCoin) => ({
        id: userCoin.coin.id,
        name: userCoin.coin.name,
        amount: userCoin.amount,
        lastPrice: userCoin.lastPrice,
      })),
    );
  }

  async giveMoney(userId: string, amount: bigint): Promise<bigint> {
    const user = await this.users.findOne(userId).then(required('user'));
    await this.users.updateOne(user.id, { balance: user.balance + amount });
    return user.balance + amount;
  }

  async consumeMoney(userId: string, amount: bigint): Promise<bigint> {
    const user = await this.users.findOne(userId).then(required('user'));
    if (user.balance < amount) {
      throw new BadRequestException('not enough money');
    }
    await this.users.updateOne(user.id, { balance: user.balance - amount });
    return user.balance - amount;
  }

  async giveCoins(
    userId: string,
    coinId: string,
    amount: bigint,
    price?: bigint,
  ): Promise<bigint> {
    const user = await this.users.findOne(userId).then(required('user'));
    const existing = await this.userCoins.findOne(user.id, coinId);
    if (existing !== null) {
      await this.userCoins.updateOne(
        user.id,
        coinId,
        existing.amount + amount,
        price,
      );
      return existing.amount + amount;
    } else {
      if (price === undefined) {
        throw new InternalServerErrorException();
      }
      await this.userCoins.createOne(user.id, coinId, amount, price);
      return amount;
    }
  }

  async consumeCoins(
    userId: string,
    coinId: string,
    amount: bigint,
  ): Promise<bigint> {
    const user = await this.users.findOne(userId).then(required('user'));
    const userCoin = await this.userCoins.findOne(user.id, coinId);
    if (userCoin === null) {
      throw new BadRequestException('not enough coins');
    }
    if (userCoin.amount < amount) {
      throw new BadRequestException('not enough coins');
    }

    await this.userCoins.updateOne(user.id, coinId, userCoin.amount - amount);
    return userCoin.amount - amount;
  }

  async consumeCoinsBatch(
    userId: string,
    coins: { id: string; amount: bigint }[],
    index = 0,
  ) {
    if (index === coins.length) {
      return;
    }

    await this.consumeCoins(userId, coins[index].id, coins[index].amount);
    try {
      await this.consumeCoinsBatch(userId, coins, index + 1);
    } catch (e) {
      await this.giveCoins(userId, coins[index].id, coins[index].amount);
      throw e;
    }
  }
}
