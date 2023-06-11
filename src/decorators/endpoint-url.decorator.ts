import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const EndpointURL = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return `${request.protocol}://${request.get('host')}${request.route.path}`;
});
