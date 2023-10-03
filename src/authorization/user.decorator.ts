import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

import { Payload } from './auth';

export const Auth = createParamDecorator<{ optional?: boolean } | undefined>(
  (data, ctx: ExecutionContext) => {
    let user: Payload | undefined | null;
    if (ctx.getType() === 'http') {
      user = ctx.switchToHttp().getRequest<Request>().user;
    } else {
      throw new ForbiddenException();
    }

    if (
      data === undefined ||
      data.optional === undefined ||
      data.optional === false
    ) {
      if (user === undefined || user === null) {
        throw new ForbiddenException();
      }
    }

    return user;
  },
);
