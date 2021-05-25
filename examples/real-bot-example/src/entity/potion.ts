import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Potion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  hpHeal: number;
}
