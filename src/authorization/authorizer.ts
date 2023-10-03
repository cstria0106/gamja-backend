import { Payload } from './auth';

export interface Authorizer {
  sign(data: Payload): string;
  authorize(token: string): Payload;
}
