import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './users.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  packageType: string;

  @Column({ default: false })
  hasUnlimitedQuota: boolean;

  @Column({ default: false })
  hasVerifiedTag: boolean;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
