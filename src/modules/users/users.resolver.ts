import { Resolver, Query, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { Therapist } from '../../entities/therapist.entity';
import { Session } from '../../entities/session.entity';
import { AdminJwtGuard } from '../admin/guards/admin-jwt.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminUser } from '../../entities/admin-user.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // Solo para administradores
  @Query(() => [User])
  @UseGuards(AdminJwtGuard)
  async users(@CurrentAdmin() admin: AdminUser): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Solo para administradores
  @Query(() => User)
  @UseGuards(AdminJwtGuard)
  async user(
    @Args('id', { type: () => ID }) id: string,
    @CurrentAdmin() admin: AdminUser,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  // Solo para administradores
  @Query(() => User, { nullable: true })
  @UseGuards(AdminJwtGuard)
  async userByEmail(
    @Args('email') email: string,
    @CurrentAdmin() admin: AdminUser,
  ): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }

  // Solo para administradores
  @Query(() => [User])
  @UseGuards(AdminJwtGuard)
  async activeUsers(@CurrentAdmin() admin: AdminUser): Promise<User[]> {
    return this.usersService.findActiveUsers();
  }

  // Solo para administradores
  @Query(() => [User])
  @UseGuards(AdminJwtGuard)
  async usersByTherapist(
    @Args('therapistId', { type: () => ID }) therapistId: string,
    @CurrentAdmin() admin: AdminUser,
  ): Promise<User[]> {
    return this.usersService.findUsersByTherapist(therapistId);
  }

  // Para usuario autenticado - su propio perfil
  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  // Solo para administradores
  @Query(() => Number)
  @UseGuards(AdminJwtGuard)
  async userCount(@CurrentAdmin() admin: AdminUser): Promise<number> {
    return this.usersService.getUserCount();
  }

  // Solo para administradores
  @Query(() => Number)
  @UseGuards(AdminJwtGuard)
  async activeUserCount(@CurrentAdmin() admin: AdminUser): Promise<number> {
    return this.usersService.getActiveUserCount();
  }

  // Field resolvers
  @ResolveField(() => Therapist, { nullable: true })
  async therapist(@Parent() user: User): Promise<Therapist | null> {
    if (!user.therapistId) {
      return null;
    }
    
    const userWithTherapist = await this.usersService.findOneWithRelations(user.id);
    return userWithTherapist.therapist || null;
  }

  @ResolveField(() => [Session])
  async sessions(@Parent() user: User): Promise<Session[]> {
    const userWithSessions = await this.usersService.findOneWithRelations(user.id);
    return userWithSessions.sessions || [];
  }
}