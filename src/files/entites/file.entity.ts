import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column({
    type: 'text', // Use 'text' or 'varchar' for Base64 data
  })
  data: string; // Store Base64 encoded data
}
