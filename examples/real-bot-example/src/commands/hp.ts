import * as Discord from "discord.js";
import { HeroRepository } from "../repositories/heroRepository";
import { getHeroRepository } from "../utils/repositoryHandler";

/**
 * Shows hero's total amount of life
 * @since 0.1
 * @param msg Discord last message related to the command
 */
export async function hp(msg: Discord.Message) {
  let heroRepository: HeroRepository;

  try {
    heroRepository = getHeroRepository();
  } catch (error) {
    msg.channel.send(error);
    return;
  }

  try {
    const hero = await heroRepository.findbyId(msg.author.id);

    if (hero) {
      msg.channel.send("Your current hp is " + hero.hpActual + " / " + hero.hpTotal);
    } else {
      msg.reply("You don't seems to have a hero");
    }
  } catch (error) {
    msg.channel.send(error);
  }
}
