import { Entity, Column, ChildEntity } from "typeorm";
import { Equip } from "./equip";

@ChildEntity("weapon")
export class Weapon extends Equip {
  @Column()
  damage: number;
}
