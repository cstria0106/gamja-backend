import { Module } from '@nestjs/common';

import { SignController } from './sign.controller';

@Module({
  controllers: [SignController],
})
export class SignModule {}
