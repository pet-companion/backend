import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserInformation = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
