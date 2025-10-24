import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { CreateUserInput } from './create-user.dto';
import { UserStatus } from '../../../entities/user.entity';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => UserStatus, { nullable: true })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  requiresPasswordChange?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;
}