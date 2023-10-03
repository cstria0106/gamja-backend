import { Payload } from './authorization/auth';

declare module 'express' {
  interface Request {
    user?: Payload | null;
  }
}
