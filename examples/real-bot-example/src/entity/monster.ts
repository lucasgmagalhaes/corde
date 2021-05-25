import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, BaseEntity } from "typeorm";
import { Equip } from "./equip";

@Entity()
export class Monster extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  level: number;

  @Column()
  damage: number;

  @Column()
  hp: number;

  @Column()
  defence: number;

  @Column()
  givedxp: number;

  @Column()
  givedgold: number;

  @JoinColumn()
  @OneToOne((type) => Equip)
  equipDrop: Promise<Equip>;

  @Column()
  equipDropChance: number;
}
