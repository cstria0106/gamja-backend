import { Module } from '@nestjs/common';

import { QnaController } from './qna.controller';
import { QnaRepository } from './qna.repository';
import { QnaService } from './qna.service';

@Module({
  providers: [QnaService, QnaRepository],
  controllers: [QnaController],
})
export class QnaModule {}
