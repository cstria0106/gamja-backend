import { BadRequestException } from '@nestjs/common';

export function bigint(value: string | number, resource?: string): bigint;
export function bigint(
  value: string | number | null,
  resource?: string,
): bigint | null;
export function bigint(
  value?: string | number,
  resource?: string,
): bigint | undefined;
export function bigint(value?: string | number | null, resource?: string) {
  if (value === undefined || value === null) return value;

  if (typeof value === 'string') {
    if (!/^\d+$/.test(value))
      throw new BadRequestException(
        `Invalid bigint${resource ? ` ${resource}` : ''}`,
      );
  }

  return BigInt(value);
}

export module bigint {
  export const max = (...args: bigint[]) =>
    args.reduce((m, e) => (e > m ? e : m));
  export const min = (...args: bigint[]) =>
    args.reduce((m, e) => (e < m ? e : m));
  export const abs = (value: bigint) => (value < bigint(0) ? -value : value);
}
