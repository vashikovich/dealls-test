import { Gender } from 'src/enums/gender.enum';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn({ type: 'uuid' })
  id: string;
  @Column()
  name: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ type: 'enum', enum: Gender })
  @Index()
  gender: Gender;

  @OneToOne(() => User, (user) => user.preferences)
  @JoinColumn({ name: 'id' })
  user: User;
}
