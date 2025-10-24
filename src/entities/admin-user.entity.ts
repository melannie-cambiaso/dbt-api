import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  SUPPORT = 'support'
}

registerEnumType(AdminRole, {
  name: 'AdminRole',
});

@ObjectType()
@Entity('admin_users')
export class AdminUser {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Field()
  @Column()
  name: string;

  @Field(() => AdminRole)
  @Column({
    type: 'enum',
    enum: AdminRole,
    default: AdminRole.ADMIN
  })
  role: AdminRole;

  @Field({ nullable: true })
  @Column({ name: 'last_access', nullable: true })
  lastAccess: Date;

  @Field()
  @Column({ name: 'requires_password_change', default: true })
  requiresPasswordChange: boolean;

  @Field(() => [String], { nullable: true })
  @Column({ name: 'allowed_ips', type: 'jsonb', nullable: true })
  allowedIps: string[];

  @Field()
  @Column({ default: true })
  active: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}