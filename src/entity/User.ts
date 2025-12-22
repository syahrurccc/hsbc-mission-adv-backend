import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Double,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  fullname!: string;

  @Column({
    type: "varchar",
    length: 100,
    unique: true,
  })
  username!: string;

  @Column({ type: "varchar", unique: true })
  @Index()
  email!: string;
  
  @Column({ type: "varchar", length: 100 })
  password!: string;

  @Column({ type: "varchar", nullable: true })
  @Index()
  activation_token?: string | null;
  
  @Column({ type: "timestamptz", nullable: true })
  token_expires_at?: Date | null;

  @Column({ type: "boolean", default: false })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
