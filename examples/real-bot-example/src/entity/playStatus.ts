import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";
import { Task } from "../enums/action";
import { Adventure } from "./adventure";

@Entity("play_status")
export class PlayStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: Task, nullable: true })
  task?: Task;

  @Column({ default: 0 })
  monsterskilled: number;

  @Column({ default: 0 })
  exp: number;

  @Column({ default: 0 })
  gold: number;

  @Column({ default: 0 })
  timestarted: number;

  @JoinColumn({ name: "idadventure", referencedColumnName: "id" })
  @OneToOne(() => Adventure, { nullable: true })
  adventure: Promise<Adventure>;

  constructor(id?: number) {
    if (id) {
      this.id = id;
    }

    this.exp = 0;
    this.gold = 0;
    this.monsterskilled = 0;
    this.task = null;
    this.timestarted = 0;
    this.adventure = null;
  }
}
