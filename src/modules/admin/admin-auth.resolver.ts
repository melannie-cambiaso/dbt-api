import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginInput } from './dto/admin-login.dto';
import { AdminAuthResponse } from './dto/admin-auth-response.dto';
import { AdminUser } from '../../entities/admin-user.entity';
import { AdminJwtGuard } from './guards/admin-jwt.guard';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';

@Resolver()
export class AdminAuthResolver {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Mutation(() => AdminAuthResponse)
  async adminLogin(
    @Args('input') input: AdminLoginInput,
    @Context() context: any,
  ): Promise<AdminAuthResponse> {
    // Obtener IP del cliente desde el contexto de la petición
    const clientIp = context.req?.ip || context.req?.connection?.remoteAddress;
    
    return this.adminAuthService.login(input, clientIp);
  }

  @Query(() => AdminUser)
  @UseGuards(AdminJwtGuard)
  async adminMe(@CurrentAdmin() admin: AdminUser): Promise<AdminUser> {
    return admin;
  }
}