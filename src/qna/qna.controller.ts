import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';

import { Payload } from '../authorization/auth';
import { Roles } from '../authorization/roles.decorator';
import { Auth } from '../authorization/user.decorator';
import { QnaService } from './qna.service';

export module ListAnswered {
  export type Response = {
    qna: {
      id: string;
      question: string;
      answer: string;
      answeredAt: Date;
    }[];
  };
}

export module ManageListNotAnswered {
  export type Response = {
    qna: {
      id: string;
      question: string;
      createdAt: Date;
    }[];
  };
}

export module Create {
  export type Body = {
    question: string;
  };
}

export module ManageAnswer {
  export type Body = {
    answer: string;
  };
}

@Controller('qna')
export class QnaController {
  constructor(private readonly qna: QnaService) {}

  @TypedRoute.Get('answered')
  async listAnswered(): Promise<ListAnswered.Response> {
    const qna = await this.qna.listAnswered();
    return { qna };
  }

  @Roles(['ADMIN'])
  @TypedRoute.Get('not-answered')
  async manageListNotAnswered(): Promise<ManageListNotAnswered.Response> {
    const qna = await this.qna.listNotAnswered();
    return { qna };
  }

  @Roles(['USER'])
  @TypedRoute.Post()
  async create(
    @Auth() user: Payload,
    @TypedBody() body: Create.Body,
  ): Promise<void> {
    await this.qna.create({ userId: user.id, question: body.question });
  }

  @Roles(['ADMIN'])
  @TypedRoute.Post(':id/answer')
  async manageAnswer(
    @TypedParam('id') id: string,
    @TypedBody() body: ManageAnswer.Body,
  ) {
    await this.qna.answer(id, body.answer);
  }
}
