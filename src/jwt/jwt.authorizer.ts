import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import typia from 'typia';

import { Payload } from '../authorization/auth';
import { Authorizer } from '../authorization/authorizer';

export interface JwtPayload {
  id: string;
}

@Injectable()
export class JwtAuthorizer implements Authorizer {
  private secret: Buffer;

  constructor(secret: string) {
    const secretBytes = Buffer.from(secret, 'base64');
    this.secret = secretBytes;
  }

  sign(data: Payload): string {
    return jwt.sign(typia.misc.assertPrune(data), this.secret);
  }
  authorize(token: string): Payload {
    return typia.misc.assertPrune<JwtPayload>(jwt.verify(token, this.secret));
  }
}
