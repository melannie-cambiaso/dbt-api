import { ObjectType, Field } from '@nestjs/graphql';
import { AdminUser } from '../../../entities/admin-user.entity';

@ObjectType()
export class AdminAuthResponse {
  @Field()
  accessToken: string;

  @Field(() => AdminUser)
  admin: AdminUser;

  @Field()
  expiresIn: string;
}