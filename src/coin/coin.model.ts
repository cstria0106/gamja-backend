export type Coin = {
  id: string;
  name: string;
  price: bigint;
  minPrice: bigint;
  maxPrice: bigint;
  amount: bigint;
};

export module Coin {
  export module View {
    export type Default = Pick<Coin, 'id' | 'name' | 'price' | 'amount'>;
  }

  export module Input {
    export type Create = {
      id: string;
      name: string;
      price: bigint;
      minPrice: bigint;
      maxPrice: bigint;
      amount: bigint;
    };
  }
}
