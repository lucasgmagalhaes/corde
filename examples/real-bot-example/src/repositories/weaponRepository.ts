import { Repository, EntityRepository } from "typeorm";
import { dbConnection } from "../../dbconn";
import { Weapon } from "../entity/weapon";

@EntityRepository(Weapon)
export class WeaponRepository extends Repository<Weapon> {
  /**
   * Search for all weapons in the database
   */
  async findAll(): Promise<Weapon[]> {
    try {
      return await super.find();
    } catch (error) {
      console.log(error);
      return Promise.reject("Hmm, there is something wrong with weapon search");
    }
  }

  /**
   * Returns the first weapon used by the hero in the game
   */
  async findFirstWeapon(): Promise<Weapon> {
    try {
      return await super.findOne({ where: { level: 1 } });
    } catch (error) {
      console.log(error);
      return Promise.reject("We can not get the first weapon for start your journey. Sorry");
    }
  }
}

export function getWeaponpository(): WeaponRepository {
  return dbConnection.getCustomRepository(WeaponRepository);
}
