import { Repository, EntityRepository } from "typeorm";
import { dbConnection } from "../../dbconn";
import { Proficience } from "../entity/proficience";

@EntityRepository(Proficience)
export class ProficienceRepository extends Repository<Proficience> {}

export function getProficienceRepository(): ProficienceRepository {
  return dbConnection.getCustomRepository(ProficienceRepository);
}
