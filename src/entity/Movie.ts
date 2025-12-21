import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { AppDataSource } from "../dataSource";

export type MovieType = "movie" | "series"

@Entity("movies")
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  title!: string;

  @Column({ length: 100 })
  poster_url!: string;
  
  @Column({ 
    type: "enum",
    enum: ["movie", "series"],
    nullable: true,
    default: null
  })
  type!: MovieType;

  @Column("text")
  synopsis!: string;
  
  @Column({ length: 32 })
  genre!: string;
  
  @Column("int")
  year!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export const movieRepo = AppDataSource.getRepository(Movie);
