import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthenticationModule } from './authentication/authentication.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { Authorize } from './authorization/authorize.guard';
import { CoinModule } from './coin/coin.module';
import { CryptoModule } from './crypto/crypto.module';
import { JwtAuthorizer } from './jwt/jwt.authorizer';
import { MarketModule } from './market/market.module';
import { PrismaModule } from './prisma/prisma.module';
import { SignController } from './sign/sign.controller';
import { SignModule } from './sign/sign.module';
import { UserModule } from './user/user.module';
import { QnaModule } from './qna/qna.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthorizationModule.forRoot({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new JwtAuthorizer(config.getOrThrow<'string'>('JWT_SECRET')),
      isGlobal: true,
    }),
    UserModule,
    PrismaModule,
    SignModule,
    AuthenticationModule,
    CryptoModule,
    CoinModule,
    MarketModule,
    QnaModule,
  ],
  controllers: [SignController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: Authorize,
    },
  ],
})
export class AppModule {}
