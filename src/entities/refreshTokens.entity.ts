import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { User } from './users.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  tokenHash: string;

  @Index()
  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: false })
  revoked: boolean;

  @Column({ type: 'timestamptz' })
  expiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
