import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserPreferences } from './userPreferences.entity';
import { SwipeHistory } from './swipeHistories.entity';
import { Subscription } from './subscriptions.entity';
import { UserProfile } from './userProfiles.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserPreferences;

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
