import { NotFoundException } from '@nestjs/common';

export function required<T>(name?: string) {
  return (value: T) => {
    if (value === null || value === undefined) {
      throw new NotFoundException(
        name
          ? `${name.substring(0, 1).toUpperCase()}${name.substring(
              1,
            )} is not found`
          : 'the resource is not found',
      );
    }

    return value;
  };
}
