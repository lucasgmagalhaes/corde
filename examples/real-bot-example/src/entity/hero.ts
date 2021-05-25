import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn, ManyToMany } from "typeorm";
import { Weapon } from "./weapon";
import { PlayStatus } from "./playStatus";
import { Proficience } from "./proficience";
import { HeroClass } from "./heroClass";
import { Shield } from "./shield";
import { JsonHandle } from "../utils/jsonHandle";
import { InventoryEquip } from "./inventoryEquip";

@Entity()
export class Hero {
  @PrimaryColumn({ type: "bigint" })
  id: number;

  @Column()
  name: string;

  @Column()
  level: number;

  @Column("integer", { name: "hptotal" })
  hpTotal: number;

  @Column("integer", { name: "hpactual" })
  hpActual: number;

  @Column()
  xp: number;

  @Column("integer", { name: "levelmaxxp" })
  levelMaxXp: number;

  @Column()
  gold: number;

  @Column()
  deaths: number;

  @Column("varchar", { name: "monsterskilled" })
  monstersKilled: number;

  @OneToOne((type) => Shield, { onDelete: "CASCADE" })
  @JoinColumn({ name: "idshield", referencedColumnName: "id" })
  shield: Promise<Shield>;

  @JoinColumn({ name: "idweapon", referencedColumnName: "id" })
  @OneToOne((type) => Weapon)
  weapon: Promise<Weapon>;

  @OneToOne((type) => PlayStatus, { onDelete: "CASCADE" })
  @JoinColumn({ name: "idplaystatus" })
  playStatus: Promise<PlayStatus>;

  @JoinColumn({ name: "iddamageproficience" })
  @OneToOne((type) => Proficience, { onDelete: "CASCADE" })
  damageProficience: Promise<Proficience>;

  @JoinColumn({ name: "iddefenceproficience" })
  @OneToOne((type) => Proficience, { onDelete: "CASCADE" })
  defenceProficience: Promise<Proficience>;

  @JoinColumn({ name: "idheroclass" })
  @OneToOne((type) => HeroClass, { onDelete: "CASCADE" })
  heroClass: Promise<HeroClass>;

  @ManyToMany((type) => InventoryEquip, { onDelete: "CASCADE" })
  inventoryItens: Promise<InventoryEquip[]>;

  constructor(name: string, userId: number) {
    this.id = userId;
    this.name = name;
    this.level = 1;
    this.levelMaxXp = 100;
    this.xp = 0;
    this.hpTotal = 100;

    this.gold = 0;
    this.deaths = 0;
    this.monstersKilled = 0;
    this.hpActual = 100;
  }

  /**
   * Return the value of all basics attributes(no foreign keys) of the class
   * to the save values when a new Hero is created.
   */
  async reset() {
    this.level = 1;
    this.levelMaxXp = 100;
    this.xp = 0;
    this.hpTotal = 100;

    this.gold = 0;
    this.deaths = 0;
    this.monstersKilled = 0;
    this.hpActual = 100;
  }

  /**
   * sum the actual amount of exp of the hero with the value
   * informed in parameter. If the result is a value bigger than the
   * maximum amount of experience for the level, the hero has his level
   * upgraded. The experience is reseted and the remain of experience that
   * left (if left) is added to to the actual value of exp(in the case, 0)
   *
   * @param value amount of experience to update
   */
  updateExp(value: number): void {
    if (value + this.xp >= this.levelMaxXp) {
      this.xp = value + this.xp - this.levelMaxXp;
      this.level++;
      this.levelMaxXp = JsonHandle.getLevelById(this.level).exp;
    }
    this.xp += value;
  }
}
