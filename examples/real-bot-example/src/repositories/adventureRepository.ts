import { Repository, EntityRepository } from "typeorm";
import { Adventure } from "../entity/adventure";
import { dbConnection } from "../../dbconn";

@EntityRepository(Adventure)
export class AdventureRepository extends Repository<Adventure> {
  async getByLevel(level: number): Promise<Adventure> {
    return super.findOne({ where: { level: level } });
  }
}

export function getAdventureRepository(): AdventureRepository {
  return dbConnection.getCustomRepository(AdventureRepository);
}
