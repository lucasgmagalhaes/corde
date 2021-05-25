import * as Discord from "discord.js";
import { getTime } from "../utils/time";
import { HeroDieError } from "../errors/heroDieError";
import { getHeroRepository } from "../utils/repositoryHandler";

/**
 * Returns hero from exploration / training
 *  * @since 0.1
 * @param msg message caller
 */
export async function back(msg: Discord.Message): Promise<void> {
  const heroRepository = getHeroRepository();

  try {
    const hero = await heroRepository.findbyId(msg.author.id);
    const playStatus = await hero.playStatus;

    if (hero === null) {
      msg.channel.send("You seems not to have a hero to call him back");
    } else if (playStatus.task !== null) {
      try {
        const status = await heroRepository.finishHeroTraining(hero);

        msg.channel.send(
          `You killed ${status} monsters. ` +
            `Got ${status.gold} of gold and ${status.exp} of experience.` +
            ` You explored for ${getTime(status.timestarted)}`,
        );
      } catch (error) {
        // hero died in exploration
        const er: HeroDieError = error;
        msg.channel.send(er.message);
      }
    } else {
      msg.channel.send(
        "Well.. Your hero are not training or exploring. YOU HAVE TO DO SOMETHING ABOUT THIS",
      );
    }
  } catch (error) {
    msg.channel.send(error);
  }
}
