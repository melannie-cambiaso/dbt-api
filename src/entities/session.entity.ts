import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from './user.entity';
import { DailyRecord } from './daily-record.entity';

export enum SessionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ResponseFrequency {
  DAILY = 'daily',
  TWICE_DAILY = 'twice_daily',
  WEEKLY = 'weekly'
}

registerEnumType(SessionStatus, {
  name: 'SessionStatus',
});

registerEnumType(ResponseFrequency, {
  name: 'ResponseFrequency',
});

@ObjectType()
@Entity('sessions')
export class Session {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
  @Column({ name: 'user_id' })
  userId: string;

  @Field()
  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Field({ nullable: true })
  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate: Date;

  @Field(() => ResponseFrequency)
  @Column({
    type: 'enum',
    enum: ResponseFrequency,
    name: 'response_frequency'
  })
  responseFrequency: ResponseFrequency;

  @Field()
  @Column({ name: 'phone_consultation_used', default: false })
  phoneConsultationUsed: boolean;

  @Field(() => SessionStatus)
  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.ACTIVE
  })
  status: SessionStatus;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, user => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => [DailyRecord])
  @OneToMany(() => DailyRecord, dailyRecord => dailyRecord.session)
  dailyRecords: DailyRecord[];
}
