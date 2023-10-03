import { Injectable } from '@nestjs/common';
import typia from 'typia';

import { PrismaService } from '../prisma/prisma.service';
import { Qna } from './qna.model';

@Injectable()
export class QnaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyAnswered(): Promise<Qna.Variant.Answered[]> {
    return this.prisma.qna
      .findMany({
        where: {
          answeredAt: { not: null },
          answer: { not: null },
        },
        orderBy: {
          answeredAt: 'desc',
        },
      })
      .then((qnas) => typia.assert<Qna.Variant.Answered[]>(qnas));
  }

  async findManyNotAnswered(): Promise<Qna.Variant.NotAnswered[]> {
    return this.prisma.qna
      .findMany({
        where: {
          answeredAt: null,
          answer: null,
        },
        orderBy: {
          answeredAt: 'desc',
        },
      })
      .then((qnas) => typia.assert<Qna.Variant.NotAnswered[]>(qnas));
  }
  async createOne(
    data: Omit<Qna, 'id' | 'createdAt' | 'answer' | 'answeredAt'>,
  ): Promise<void> {
    await this.prisma.qna.create({
      data: {
        ...data,
        createdAt: new Date(),
        answer: null,
        answeredAt: null,
      },
    });
  }

  async updateOne(criteria: Qna.Criteria, data: Partial<Qna>): Promise<void> {
    await this.prisma.qna.update({
      where: criteria,
      data,
    });
  }
}
