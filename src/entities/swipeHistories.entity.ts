import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('swipe_history')
export class SwipeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isLike: boolean;

  @Column({ type: 'date' })
  swipeDate: string;

  @Column({ type: 'string' })
  userId: string;

  @ManyToOne(() => User, (user) => user.swipes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'string' })
  targetUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'target_user_id' })
  targetUser: User;

  @CreateDateColumn()
  createdAt: Date;
}
