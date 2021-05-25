import { dbConnection } from "../../dbconn";
import { HeroRepository } from "../repositories/heroRepository";

export function getHeroRepository(): HeroRepository {
  return dbConnection.getCustomRepository(HeroRepository);
}
