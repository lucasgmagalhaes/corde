import * as Discord from "discord.js";
import { Hero } from "../entity/hero";
import { HeroRepository } from "../repositories/heroRepository";
import { getHeroRepository } from "../utils/repositoryHandler";

/**
 * Shows hero's profile
 * @since 0.1
 * @param msg Discord last message related to the command
 */
export async function profile(msg: Discord.Message) {
  let heroRepository: HeroRepository;
  let hero: Hero;

  try {
    heroRepository = getHeroRepository();
    hero = await heroRepository.findbyId(msg.author.id);
  } catch (error) {
    msg.channel.send(error);
    return;
  }

  if (!hero) {
    msg.channel.send(`Profile not found for user ${msg.author.id}`);
  }

  msg.channel.send(
    "Name: `" +
      hero.name +
      "`\n" +
      "Gold: **$" +
      hero.gold +
      "**\n" +
      "Class: `" +
      hero.heroClass +
      "`\n" +
      "Hp: " +
      hero.hpActual +
      " / " +
      hero.hpTotal +
      "\n" +
      "Level: **" +
      hero.level +
      "** (" +
      hero.xp +
      " / " +
      hero.levelMaxXp +
      " )\n" +
      "Damage proficience level: **" +
      (await hero.damageProficience).level +
      "** (" +
      hero.damageProficience.xp +
      " / " +
      hero.damageProficience.levelMaxXp +
      ")\n" +
      "Shield proficience level: **" +
      hero.shieldProficience.level +
      "** (" +
      hero.shieldProficience.xp +
      " / " +
      hero.shieldProficience.levelMaxXp +
      ")\n" +
      "Weapon: `" +
      hero.weapon.name +
      "`\n" +
      "Shield: `" +
      hero.shield.name +
      "`\n" +
      "Damage: **" +
      heroRepository.calcDamage(hero.weapon.damage, hero.damageProficience.level) +
      "**\n" +
      "Defence: **" +
      heroRepository.calcDefence(hero.shield.defence, hero.shieldProficience.level) +
      "**",
  );
}
