import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Request } from 'express';

import { PrismaService } from '../prisma/prisma.service';
import { Payload } from './auth';
import { InjectAuthorizer } from './authorization.module';
import { Authorizer } from './authorizer';
import { checkRole } from './roles';
import { Roles } from './roles.decorator';

export class Authorize implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    @InjectAuthorizer() private readonly authorizer: Authorizer,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    const token = this.getBearerToken(context);

    if (token === null) {
      if (roles !== undefined) throw new ForbiddenException();
      return true;
    }

    let payload: Payload;

    try {
      payload = this.authorizer.authorize(token);
      this.setUser(context, payload);
    } catch {
      throw new ForbiddenException();
    }

    // Check role
    if (roles !== undefined) {
      const user = await this.prisma.user.findFirstOrThrow({
        where: { id: payload.id },
      });

      if (roles.every((role) => !checkRole(user.role, role))) {
        throw new ForbiddenException();
      }
    }

    return true;
  }

  private setUser(context: ExecutionContext, user: Payload) {
    if (context.getType() === 'http') {
      const request: Request = context.switchToHttp().getRequest();
      request.user = user;
    }
  }

  private getBearerToken(context: ExecutionContext): string | null {
    let token: string | undefined;
    if (context.getType() === 'http') {
      const request: Request = context.switchToHttp().getRequest();
      token = request.headers.authorization;
    }

    const prefix = 'Bearer ';
    if (token !== undefined && token.startsWith(prefix)) {
      return token.substring(prefix.length);
    }

    return null;
  }
}
