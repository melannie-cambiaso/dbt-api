import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Therapist } from '../../entities/therapist.entity';
import { Session } from '../../entities/session.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Therapist, Session]),
    AdminModule,
    AuthModule,
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}