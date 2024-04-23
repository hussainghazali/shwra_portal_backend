import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({name: 'appointment' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ length: 255 })
  industryType: string;

  @Column({ length: 255 })
  legalIssue: string;

  @Column({ length: 255 })
  meetingType: string;

  @Column()
  meetingDate: string;

  @Column()
  meetingTime: string;

  @Column({ type: 'date', nullable: true })
  createdAt?: Date;

  @Column({ type: 'date', nullable: true })
  updatedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
