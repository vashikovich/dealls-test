import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Gender } from 'src/enums/gender.enum';

@Entity('user_preferences')
export class UserPreferences {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column()
  minAge: number;

  @Column()
  maxAge: number;

  @OneToOne(() => User, (user) => user.preferences)
  @JoinColumn({ name: 'id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
