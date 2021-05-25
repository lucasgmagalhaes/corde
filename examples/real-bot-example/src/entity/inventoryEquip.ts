import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column } from "typeorm";
import { Hero } from "./hero";
import { Equip } from "./equip";

@Entity("inventory_equip")
export class InventoryEquip {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => Hero)
  @JoinColumn({ name: "idhero" })
  hero: Promise<Hero>;

  @Column()
  equiped: boolean;

  @OneToOne((type) => Equip)
  @JoinColumn({ name: "idequip" })
  equip: Promise<Equip>;
}
