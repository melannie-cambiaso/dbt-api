import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional, IsDateString, IsUUID } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(8)
  password: string;

  @Field()
  @IsString()
  @MinLength(2)
  firstName: string;

  @Field()
  @IsString()
  @MinLength(2)
  lastName: string;

  @Field()
  @IsDateString()
  dateOfBirth: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  therapistId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}