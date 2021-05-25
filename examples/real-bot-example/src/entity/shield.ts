import { Entity, Column, ChildEntity } from "typeorm";
import { Equip } from "./equip";

@ChildEntity("shield")
export class Shield extends Equip {
  @Column()
  defence: number;
}
