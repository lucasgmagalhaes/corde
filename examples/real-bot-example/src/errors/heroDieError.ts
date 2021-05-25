import { IPlayStatus } from "../interfaces/playStatus";

/**
 * Treats hero death in exploration
 */
export class HeroDieError extends Error {
  constructor(status: IPlayStatus) {
    super();
    super.message =
      `You died after kill ${status.monsterskilled} ` +
      `monsters. Got ${status.gold} of gold and ${status.exp} of experience.`;
    super.name = "Player Death";
  }
}
