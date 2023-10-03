import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';

export type SignInBody = {
  id: string;
  password: string;
};
export type SignInResponse = {
  token: string;
};

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authentication: AuthenticationService) {}

  @TypedRoute.Post()
  async signIn(@TypedBody() input: SignInBody): Promise<SignInResponse> {
    return this.authentication.signIn(input);
  }
}
