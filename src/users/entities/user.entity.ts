import {
  Column,
  CreateDateColumn,
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

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  companyName: string;

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
}
