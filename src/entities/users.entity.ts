import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
import { UserPreferences } from './userPreferences.entity';
import { SwipeHistory } from './swipeHistories.entity';
import { Subscription } from './subscriptions.entity';
import { Gender } from 'src/enums/gender.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  // Virtual Column
  password: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ type: 'enum', enum: Gender })
  @Index()
  gender: Gender;

  @OneToOne(() => UserPreferences, (preferences) => preferences.user)
  preferences: UserPreferences;

  @OneToMany(() => SwipeHistory, (swipe) => swipe.user)
  swipes: SwipeHistory[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
