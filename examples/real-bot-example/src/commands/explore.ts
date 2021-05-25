import * as Discord from "discord.js";
import { getTimeStampFormated } from "../utils/time";
import { EXPLORATION_MAX_LEVEL, PREFIX } from "../utils/global";
import { getHeroRepository } from "../utils/repositoryHandler";
import { getAdventureRepository } from "../repositories/adventureRepository";
import { Adventure } from "../entity/adventure";

/**
 * Send user user to farm(Get gold, xp, and equips)
 * @since 0.1
 * @param msg Discord last message related to the command
 * @param level difficult of the farm field. How bigger the number, harder is the field.
 * The amount of gold, xp received by the user increases according to the value of the level
 */
export async function explore(msg: Discord.Message, level: number) {
  if (level > 0 && level <= EXPLORATION_MAX_LEVEL) {
    try {
      const heroRepository = getHeroRepository();
      const adventureRepository = getAdventureRepository();
      const hero = await heroRepository.findbyId(msg.author.id);

      if (hero !== null) {
        const adv: Adventure = await adventureRepository.getByLevel(level);

        if (adv === undefined) {
          msg.channel.send("Hmmm, the informed adventure does not exist ");
          return;
        }

        const playStatus = await hero.playStatus;
        let heroAdventure = await playStatus.adventure;

        if (heroAdventure === null) {
          heroAdventure = adv;
          playStatus.timestarted = getTimeStampFormated();

          heroRepository.updateHero(hero).then(() => {
            msg.channel.send("Send hero to explore " + adv.name) + ". Good Farmning!";
          });
        } else {
          msg.channel.send(
            "You is already exploring. Say `" + PREFIX + "status` to see how your hero is goin on",
          );
        }
      }
    } catch (error) {
      msg.channel.send(error);
    }
  } else {
    msg.channel.send(
      "You must choose a number between 1 and " + EXPLORATION_MAX_LEVEL + " to send your ",
    );
  }
}
