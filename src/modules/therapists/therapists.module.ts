import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Therapist } from '../../entities/therapist.entity';
import { User } from '../../entities/user.entity';
import { TherapistsService } from './therapists.service';
import { TherapistsResolver } from './therapists.resolver';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Therapist, User]),
    AdminModule,
  ],
  providers: [TherapistsService, TherapistsResolver],
  exports: [TherapistsService],
})
export class TherapistsModule {}