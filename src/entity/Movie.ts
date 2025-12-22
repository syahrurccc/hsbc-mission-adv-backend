import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

export type MovieType = "movie" | "series";

@Entity("movies")
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  @Index()
  title!: string;

  @Column({ type: "varchar", length: 100 })
  poster_url!: string;
  
  @Column({ 
    type: "varchar",
    length: 10,
  })
  @Index()
  type!: MovieType;

  @Column("text")
  synopsis!: string;
  
  @Column("int")
  @Index()
  year!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

