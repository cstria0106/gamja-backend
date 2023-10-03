export type UserCoin = {
  userId: string;
  coinId: string;
  amount: bigint;
  lastPrice: bigint;
};

export module UserCoin {
  export module Input {
    export type Create = Pick<UserCoin, 'amount' | 'coinId' | 'userId'>;
  }
}
