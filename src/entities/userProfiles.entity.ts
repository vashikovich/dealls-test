import { Gender } from 'src/enums/gender.enum';
import {
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
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

  // Virtual column
  isVerified: boolean;

  @OneToOne(() => User, (user) => user.preferences)
  @JoinColumn({ name: 'id' })
  user: User;

  @UpdateDateColumn()
  updatedAt: Date;

  @AfterLoad()
  afterLoad() {
    this.isVerified = this.user?.subscriptions?.[0]?.hasVerifiedTag || false;
  }
}
