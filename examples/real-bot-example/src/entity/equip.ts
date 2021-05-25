import { PrimaryGeneratedColumn, Column, Entity, TableInheritance } from "typeorm";

@Entity()
@TableInheritance({ column: { name: "type", type: "varchar" } })
export abstract class Equip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  level: number;

  @Column()
  sellPrice: number;
}
