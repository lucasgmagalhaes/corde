import * as Discord from "discord.js";
import { getHeroRepository } from "../utils/repositoryHandler";

/**
 * Inform hero's experience
 * @since 0.1
 * @param msg Discord last message related to the command
 */
export async function xp(msg: Discord.Message) {
  const heroRepository = getHeroRepository();

  try {
    const hero = await heroRepository.findbyId(msg.author.id);
    if (hero !== null) {
      const percentage = (hero.xp * 100) / hero.levelMaxXp;
      msg.channel.send(
        "You are current in level " +
          hero.level +
          ". Your experience is " +
          hero.xp +
          "/" +
          hero.levelMaxXp +
          " (" +
          percentage +
          "%)",
      );
    }
  } catch (error) {
    msg.channel.send(error);
  }
}
