export type CoinPriceHistory = {
  id: string;
  coinId: string;
  price: bigint;
  timestamp: Date;
};

export module CoinPriceHistory {
  export type Criteria = {
    coinId?: string;
    from?: Date;
    to?: Date;
  };

  export module View {
    export type Default = {
      price: bigint;
      timestamp: Date;
    };
  }
}
