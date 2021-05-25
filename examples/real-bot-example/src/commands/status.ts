import * as Discord from "discord.js";
import { getTime } from "../utils/time";
import { HeroDieError } from "../errors/heroDieError";
import { getHeroRepository } from "../utils/repositoryHandler";
import { Task } from "../enums/action";

/**
 * Inform the situation of the hero in his exploration or trainning
 * @since 0.1
 * @param msg Discord last message related to the command
 */
export async function status(msg: Discord.Message) {
  try {
    const heroRepository = getHeroRepository();
    const hero = await heroRepository.findbyId(msg.author.id);

    if (hero === null) {
      msg.channel.send("Create a hero before check his `status`");
      return;
    }

    const playStatus = await hero.playStatus;

    // hero in exploration
    if (playStatus.task === Task.EXPLORING) {
      try {
        const status = await heroRepository.updateHeroTraining(hero);

        msg.channel.send(
          `You killed ${status.monsterskilled} monsters. ` +
            `Got ${status.gold} of gold and ${status.exp} of experience.` +
            ` You explored for ${getTime(status.timestarted)}`,
        );
      } catch (error) {
        // hero died in exploration
        const er: HeroDieError = error;
        msg.channel.send(er.message);
      }

      // hero training damage
    } else if (playStatus.task === Task.DAMAGE_TRAINING) {
      const trained = await heroRepository.upgradeProficience(hero);

      msg.channel.send(
        `The hero ${hero.name} is training damage for ${getTime(trained)}.` +
          ` You alredy got ${playStatus.exp} exp`,
      );

      // hero training shield
    } else if (playStatus.task === Task.SHIELD_TRAINING) {
      const trained = await heroRepository.upgradeProficience(hero);

      msg.channel.send(
        `The hero ${hero.name} is training shield for ${getTime(trained)}.` +
          ` You alredy got ${playStatus} exp`,
      );
    } else {
      msg.channel.send("You are not exploring or training.");
      return;
    }

    heroRepository.updateHero(hero);
  } catch (error) {
    msg.channel.send(error);
  }
}
