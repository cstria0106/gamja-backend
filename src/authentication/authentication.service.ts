import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectAuthorizer } from '../authorization/authorization.module';
import { Authorizer } from '../authorization/authorizer';
import { CryptoService } from '../crypto/crypto.service';
import { UserRepository } from '../user/user.repository';

export module AuthenticationService {
  export module signIn {
    export type Data = {
      id: string;
      password: string;
    };
  }
}

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly users: UserRepository,
    private readonly crypto: CryptoService,
    @InjectAuthorizer() private readonly authorizer: Authorizer,
  ) {}

  async signIn(
    data: AuthenticationService.signIn.Data,
  ): Promise<{ token: string }> {
    // Get user
    const user = await this.users.findOne(data.id);
    if (user === null) throw new BadRequestException();

    // Encrypt password
    const [password] = await this.crypto.encrypt(
      data.password,
      Buffer.from(user.salt, 'base64'),
    );

    // Validate password
    if (password.compare(Buffer.from(user.password, 'base64')) !== 0) {
      throw new BadRequestException();
    }

    // Sign
    const token = this.authorizer.sign({ id: user.id });
    return { token };
  }
}
