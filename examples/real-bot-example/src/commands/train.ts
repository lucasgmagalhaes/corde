import * as Discord from "discord.js";
import { ProficienceType } from "../enums/proficienceType";
import { getTimeStampFormated } from "../utils/time";
import { getHeroRepository } from "../utils/repositoryHandler";
import { Task } from "../enums/action";

/**
 * Sends hero to train a Proficience(Damage or Defence)
 * @since 0.1
 * @param msg User's message on discord
 */
export async function train(msg: Discord.Message, proficience: string) {
  if (
    proficience !== undefined &&
    (proficience.toLowerCase() === ProficienceType.DAMAGE.toLowerCase() ||
      proficience.toLowerCase() === ProficienceType.SHIELD.toLowerCase())
  ) {
    try {
      const heroRepository = getHeroRepository();
      const hero = await heroRepository.findbyId(msg.author.id);

      if (hero === null) {
        msg.channel.send("Your can not send your character to train being that you haven't one");
      } else {
        const playStatus = await hero.playStatus;

        if (proficience === ProficienceType.DAMAGE) playStatus.task = Task.DAMAGE_TRAINING;
        else {
          playStatus.task = Task.SHIELD_TRAINING;
        }

        playStatus.timestarted = getTimeStampFormated();

        try {
          await heroRepository.updateHero(hero);
          msg.channel.send("hero successfully sent to train");
        } catch (error) {
          console.log("train method error: " + error);
          msg.channel.send(
            "Hmmm. looks like that we have some technical problems. " +
              "Your character won't sent to train",
          );
        }
      }
    } catch (error) {
      msg.channel.send(error);
    }
  } else {
    msg.channel.send("Please, you must choose train your `damage` or your `shield`");
  }
}
