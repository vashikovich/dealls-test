import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity('access_tokens')
export class AccessToken {
  @PrimaryGeneratedColumn()
  @Column({ type: 'integer', primary: true })
  id: number;

  @Index({ unique: true })
  @Column({ nullable: false, type: 'varchar' })
  token: string;

  @Index()
  @Column({ nullable: false, type: 'varchar' })
  refreshToken: string;

  @Column({ nullable: false, type: 'integer' })
  resourceOwnerId: number;

  @Column({ nullable: false, type: 'varchar' })
  resourceOwnerType: string;

  @Column({ nullable: true, type: 'timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
