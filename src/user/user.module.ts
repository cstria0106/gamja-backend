import { Module } from '@nestjs/common';

import { CryptoModule } from '../crypto/crypto.module';
import { BalanceHistoryRepository } from './balance-history.repository';
import { UserCoinRepository } from './user-coin.repository';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [CryptoModule],
  providers: [
    UserService,
    UserRepository,
    BalanceHistoryRepository,
    UserCoinRepository,
  ],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
