import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { JsonHandle } from "../utils/jsonHandle";

@Entity()
export class Proficience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  xp: number;

  @Column()
  levelmaxxp: number;

  constructor(id?: number) {
    if (id) {
      this.id = id;
    }

    const proficienceLevel = JsonHandle.getProficienceById(1);
    this.level = 1;
    this.xp = 0;
    this.levelmaxxp = proficienceLevel.exp;
  }
}
