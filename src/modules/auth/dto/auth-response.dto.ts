import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../../entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;

  @Field()
  expiresIn: string;
}
