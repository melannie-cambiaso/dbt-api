import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Session } from './session.entity';
import { Therapist } from './therapist.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ name: 'first_name' })
  firstName: string;

  @Field()
  @Column({ name: 'last_name' })
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Field({ nullable: true })
  @Column({ type: 'date', name: 'date_of_birth' })
  dateOfBirth: Date;

  @Field({ nullable: true })
  @Column({ name: 'profile_photo_url', nullable: true })
  profilePhotoUrl: string;

  @Field({ nullable: true })
  @Column({ name: 'therapist_id', nullable: true })
  therapistId: string;

  @Field(() => Therapist, { nullable: true })
  @ManyToOne(() => Therapist, therapist => therapist.patients)
  @JoinColumn({ name: 'therapist_id' })
  therapist: Therapist;

  @Field(() => UserStatus)
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: UserStatus;

  @Field()
  @Column({ name: 'requires_password_change', default: true })
  requiresPasswordChange: boolean;

  @Field({ nullable: true })
  @Column({ name: 'created_by_admin_id', nullable: true })
  createdByAdminId: string;

  @Field({ nullable: true })
  @Column({ name: 'admin_notes', nullable: true })
  adminNotes: string;

  @Field()
  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Field({ nullable: true })
  @Column({ name: 'last_access', nullable: true })
  lastAccess: Date;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => [Session])
  @OneToMany(() => Session, session => session.user)
  sessions: Session[];
}
