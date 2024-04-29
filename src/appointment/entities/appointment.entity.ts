import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({name: 'appointment' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ length: 255, nullable: true })
  industryType: string;

  @Column({ length: 255, nullable: true  })
  legalIssue: string;

  @Column({ length: 255, nullable: true  })
  meetingType: string;

  @Column({ nullable: true })
  meetingSlot: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
