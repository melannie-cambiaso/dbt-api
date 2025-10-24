import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateTherapistInput } from './create-therapist.dto';

@InputType()
export class UpdateTherapistInput extends PartialType(CreateTherapistInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}