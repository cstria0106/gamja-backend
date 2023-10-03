import { Module } from '@nestjs/common';

import { JwtAuthorizer } from './jwt.authorizer';

@Module({
  providers: [JwtAuthorizer],
  exports: [JwtAuthorizer],
})
export class JwtModule {}
