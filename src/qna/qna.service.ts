import { BadRequestException, Injectable } from '@nestjs/common';

import { Qna } from './qna.model';
import { QnaRepository } from './qna.repository';

@Injectable()
export class QnaService {
  constructor(private readonly qnas: QnaRepository) {}
  async listAnswered(): Promise<Qna.View.Answered[]> {
    return this.qnas.findManyAnswered();
  }

  async listNotAnswered(): Promise<Qna.View.NotAnswered[]> {
    return this.qnas.findManyNotAnswered();
  }

  async create({
    userId,
    question,
  }: {
    userId: string;
    question: string;
  }): Promise<void> {
    if (question.length > 500) {
      throw new BadRequestException('Question is too long');
    }
    await this.qnas.createOne({
      userId,
      question,
    });
  }

  async answer(id: string, answer: string): Promise<void> {
    if (answer.length > 1000) {
      throw new BadRequestException('Answer is too long');
    }
    await this.qnas.updateOne(
      {
        id,
      },
      {
        answer,
        answeredAt: new Date(),
      },
    );
  }
}
