import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Permission = (...args: string[]): CustomDecorator<string> =>
  SetMetadata('permissions', args);
