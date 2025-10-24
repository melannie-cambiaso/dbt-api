import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Session } from './session.entity';

@ObjectType()
@Entity('daily_records')
export class DailyRecord {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
  @Column({ name: 'session_id' })
  sessionId: string;

  @Field()
  @Column({ type: 'date' })
  date: Date;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  mood: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  anxiety: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  stress: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  energy: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  emotions: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  triggers: string;

  @Field({ nullable: true })
  @Column({ type: 'text', name: 'coping_strategies', nullable: true })
  copingStrategies: string;

  @Field({ nullable: true })
  @Column({ type: 'text', name: 'medication_taken', nullable: true })
  medicationTaken: string;

  @Field({ nullable: true })
  @Column({ type: 'text', name: 'sleep_hours', nullable: true })
  sleepHours: string;

  @Field({ nullable: true })
  @Column({ type: 'text', name: 'exercise_minutes', nullable: true })
  exerciseMinutes: string;

  @Field({ nullable: true })
  @Column({ type: 'text', name: 'notes', nullable: true })
  notes: string;

  @Field()
  @Column({ name: 'crisis_plan_activated', default: false })
  crisisPlanActivated: boolean;

  @Field({ nullable: true })
  @Column({ type: 'text', name: 'therapist_notes', nullable: true })
  therapistNotes: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Session)
  @ManyToOne(() => Session, session => session.dailyRecords)
  @JoinColumn({ name: 'session_id' })
  session: Session;
}
