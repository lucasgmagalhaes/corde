import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Monster } from "./monster";

@Entity()
export class Adventure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  level: number;

  @Column()
  name: string;

  @JoinColumn({ name: "idmonster" })
  @OneToOne((type) => Monster)
  monster: Promise<Monster>;
}
