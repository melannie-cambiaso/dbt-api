import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AdminUser } from '../../entities/admin-user.entity';

export const CurrentAdmin = createParamDecorator(
  (data: unknown, context: ExecutionContext): AdminUser => {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    return user;
  },
);