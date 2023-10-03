import { DynamicModule, Inject, Module } from '@nestjs/common';

import { Authorizer } from './authorizer';

const AuthorizerSymbol = Symbol('Authorizer');
export const InjectAuthorizer: () => ParameterDecorator =
  () => (target, key, parameterIndex) => {
    Inject(AuthorizerSymbol)(target, key, parameterIndex);
  };

@Module({})
export class AuthorizationModule {
  static forRoot(options: {
    useFactory: (...args: any[]) => Authorizer;
    inject: any[];
    isGlobal?: boolean;
  }): DynamicModule {
    return {
      module: AuthorizationModule,
      providers: [
        {
          provide: AuthorizerSymbol,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [AuthorizerSymbol],
      global: options.isGlobal,
    };
  }
}
