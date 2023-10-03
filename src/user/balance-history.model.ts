export type BalanceHistory = {
  userId: string;
  amount: bigint;
  reason: string | null;
  createdAt: Date;
};

export module BalanceHistory {
  export module View {
    export type Owned = Pick<BalanceHistory, 'amount' | 'reason' | 'createdAt'>;
  }
}
