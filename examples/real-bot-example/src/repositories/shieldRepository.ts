import { Repository, EntityRepository } from "typeorm";
import { dbConnection } from "../../dbconn";
import { Shield } from "../entity/shield";

@EntityRepository(Shield)
export class ShieldRepository extends Repository<Shield> {
  findAll(): Promise<Shield[]> {
    return super.find();
  }

  /**
   * Returns the first weapon used by the hero in the game
   */
  findFirstShield(): Promise<Shield> {
    return super.findOne({ where: { level: 1 } });
  }
}

export function getShieldpository(): ShieldRepository {
  return dbConnection.getCustomRepository(ShieldRepository);
}
