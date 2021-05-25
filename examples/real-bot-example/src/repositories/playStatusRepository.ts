import { Repository, EntityRepository } from "typeorm";
import { dbConnection } from "../../dbconn";
import { PlayStatus } from "../entity/playStatus";

@EntityRepository(PlayStatus)
export class PlayStatusRepository extends Repository<PlayStatus> {}

export function getPlayStatusRepository(): PlayStatusRepository {
  return dbConnection.getCustomRepository(PlayStatusRepository);
}
