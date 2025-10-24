import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TherapistsService } from './therapists.service';
import { Therapist } from '../../entities/therapist.entity';
import { User } from '../../entities/user.entity';
import { CreateTherapistInput } from './dto/create-therapist.dto';
import { UpdateTherapistInput } from './dto/update-therapist.dto';
import { AdminJwtGuard } from '../admin/guards/admin-jwt.guard';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { AdminUser } from '../../entities/admin-user.entity';

@Resolver(() => Therapist)
@UseGuards(AdminJwtGuard)
export class TherapistsResolver {
  constructor(private readonly therapistsService: TherapistsService) {}

  @Mutation(() => Therapist)
  async createTherapist(
    @Args('input') createTherapistInput: CreateTherapistInput,
    @CurrentAdmin() admin: AdminUser,
  ): Promise<Therapist> {
    return this.therapistsService.create(createTherapistInput);
  }

  @Query(() => [Therapist])
  async therapists(
    @Args('activeOnly', { type: () => Boolean, defaultValue: false }) activeOnly: boolean,
    @CurrentAdmin() admin: AdminUser,
  ): Promise<Therapist[]> {
    return this.therapistsService.findAll(activeOnly);
  }

  @Query(() => Therapist)
  async therapist(
    @Args('id', { type: () => ID }) id: string,
    @CurrentAdmin() admin: AdminUser,
  ): Promise<Therapist> {
    return this.therapistsService.findOne(id);
  }

  @Query(() => Therapist, { nullable: true })
  async therapistByEmail(
    @Args('email') email: string,
    @CurrentAdmin() admin: AdminUser,
  ): Promise<Therapist | null> {
    return this.therapistsService.findByEmail(email);
  }

  @Mutation(() => Therapist)
  async updateTherapist(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateTherapistInput: UpdateTherapistInput,
    @CurrentAdmin() admin: AdminUser,
  ): Promise<Therapist> {
    return this.therapistsService.update(id, updateTherapistInput);
  }

  @Mutation(() => Boolean)
  async removeTherapist(
    @Args('id', { type: () => ID }) id: string,
    @CurrentAdmin() admin: AdminUser,
  ): Promise<boolean> {
    return this.therapistsService.remove(id);
  }

  @Mutation(() => Therapist)
  async deactivateTherapist(
    @Args('id', { type: () => ID }) id: string,
    @CurrentAdmin() admin: AdminUser,
  ): Promise<Therapist> {
    return this.therapistsService.deactivate(id);
  }

  @Mutation(() => Therapist)
  async activateTherapist(
    @Args('id', { type: () => ID }) id: string,
    @CurrentAdmin() admin: AdminUser,
  ): Promise<Therapist> {
    return this.therapistsService.activate(id);
  }

  @Query(() => Number)
  async therapistPatientCount(
    @Args('id', { type: () => ID }) id: string,
    @CurrentAdmin() admin: AdminUser,
  ): Promise<number> {
    return this.therapistsService.getPatientCount(id);
  }

  @ResolveField(() => [User])
  async patients(@Parent() therapist: Therapist): Promise<User[]> {
    const therapistWithPatients = await this.therapistsService.findOneWithPatients(therapist.id);
    return therapistWithPatients.patients || [];
  }
}