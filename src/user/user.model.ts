export type User = {
  id: string;
  name: string;
  role: 'ADMIN' | 'USER';
  password: string;
  salt: string;
  balance: bigint;
};

export module User {
  export module View {
    export type Default = Pick<User, 'id'>;
    export type Owned = Pick<User, 'id' | 'balance' | 'name'>;
  }
}
