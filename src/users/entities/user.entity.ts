import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { File } from 'src/files/entites/file.entity';
import { Notification } from 'src/notifications/entites/notification.entity';

export enum UserType {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
}
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'enum', enum: UserType })
  type: UserType;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column()
  isActive: boolean;

  @Column({ nullable: true })
  companyName: string;
  
  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'double precision', nullable: true })
  latitude?: number;

  @Column({ type: 'double precision', nullable: true })
  longitude?: number;

  @Column({ type: 'double precision', nullable: true })
  rating?: number;

  @JoinColumn({ name: 'fileId' })
  @OneToOne(() => File, {
    nullable: true,
  })
  file?: File;
  @Column({ nullable: true })
  fileId?: string;

  @JoinColumn({ name: 'notificationId' })
  @OneToOne(() => Notification, {
    nullable: true,
  })
  notification?: Notification;
  @Column({ nullable: true })
  notificationId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
