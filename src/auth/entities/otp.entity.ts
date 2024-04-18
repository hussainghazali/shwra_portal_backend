import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OTPReason {
  'Login' = 'Login',
  'Register' = 'Register',
  'VerifyNumber' = 'VerifyNumber',
  'ResetPassword' = 'ResetPassword',
  'ChangePassword' = 'ChangePassword',
  'ChangeEmail' = 'ChangeEmail',
  'ChangePhoneNumber' = 'ChangePhoneNumber',
}

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  reason: OTPReason;

  @Column()
  type: 'email' | 'sms';

  @Column()
  inbox: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isConsumed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
