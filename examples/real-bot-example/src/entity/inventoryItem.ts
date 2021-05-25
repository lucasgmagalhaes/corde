import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column } from "typeorm";
import { Hero } from "./hero";
import { Equip } from "./equip";
import { Potion } from "./potion";

@Entity("inventory_potion")
export class InventoryPotion {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: "idhero" })
  @OneToOne((type) => Hero)
  hero: Promise<Hero>;

  @Column()
  amount: number;

  @JoinColumn({ name: "idpotion" })
  @OneToOne((type) => Equip)
  equip: Promise<Potion>;
}
