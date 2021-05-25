import * as Discord from "discord.js";
import { reactionData } from "../utils/global";
import { getHeroRepository } from "../utils/repositoryHandler";
import { Equip } from "../entity/equip";
import { getShieldpository } from "../repositories/shieldRepository";
import { getWeaponpository } from "../repositories/weaponRepository";
import { Weapon } from "../entity/weapon";
import { EmojiSymbols } from "../enums/emojis";
import { Shield } from "../entity/shield";

/**
 * Informs all available items from selected type.
 * @since 0.1
 * @param msg Discord last message related to the command
 * @param shopType Specify the type of shop (weapon/shield)
 */
export async function shop(msg: Discord.Message, shopType: string) {
  const heroRepository = getHeroRepository();
  const hero = await heroRepository.findbyId(msg.author.id);

  try {
    if (hero === null) {
      msg.channel.send("Create a hero before check the shop ");
      return;
    }

    if (shopType !== undefined && shopType.toLocaleLowerCase().trim() === "shield") {
      shieldShop(msg);
    } else if (shopType !== undefined && shopType.toLocaleLowerCase().trim() === "weapon") {
      weaponShop(msg);
    } else {
      msg.channel.send("Want to buy sword or shield ?").then(() => {
        msg.channel
          .awaitMessages((responseName) => responseName.author.id === msg.author.id, {
            max: 1,
            time: 10000,
            errors: ["time"],
          })
          .then((response) => {
            const type = response.first().content.toLocaleLowerCase().trim();
            if (type === "shield") {
              shieldShop(msg);
            } else if (type === "sword") {
              weaponShop(msg);
            }
          });
      });
    }
  } catch (error) {
    msg.channel.send(error);
  }
}

export async function addReactions(botMessage: Discord.Message) {
  await botMessage.react(EmojiSymbols["⏪"]);
  await botMessage.react(EmojiSymbols["◀"]);
  await botMessage.react(EmojiSymbols["▶"]);
  await botMessage.react(EmojiSymbols["⏩"]);
}

export function addRectionData(
  equips: Equip[],
  botMessage: Discord.Message,
  userMessage: Discord.Message,
) {
  reactionData.data = equips;
  reactionData.index = 0;
  reactionData.userId = userMessage.author.id;
  reactionData.message = botMessage;
}

/**
 * Informs all available items from selected type.
 * @param msg Discord last message related to the command
 */
export async function shieldShop(msg: Discord.Message) {
  const shields = await getShieldpository().findAll();
  const items: Array<string> = new Array<string>();

  shields.forEach(async (shield) =>
    items.push(
      `Id: ${shield.id}\n` +
        `Name: ${shield.name}\n` +
        `Defence: ${shield.defence}\n` +
        `Price: ${shield.price}\n\n`,
    ),
  );

  msg.channel.send(items[0]).then(async (message: Discord.Message) => {
    addReactions(message);
    addRectionData(shields, message, msg);
  });
}

/**
 * Informs all available weapons for seal
 * @param msg Discord last message related to the command
 */
export async function weaponShop(msg: Discord.Message) {
  const weapons = await getWeaponpository().findAll();
  const items: Array<string> = new Array<string>();

  weapons.forEach(async (weapons) =>
    items.push(
      `Id: ${weapons.id}\n` +
        `Name: ${weapons.name}\n` +
        `Damage: ${weapons.damage}\n` +
        `Price: ${weapons.price}\n\n`,
    ),
  );

  msg.channel.send(items[0]).then(async (message: Discord.Message) => {
    addReactions(message);
    addRectionData(weapons, message, msg);
  });
}

export function backOneItem(
  reaction: Discord.MessageReaction,
  user: Discord.User | Discord.PartialUser,
) {
  if (user.id === reactionData.userId && reactionData.index - 1 > -1) {
    reactionData.index--;

    const data = reactionData.data;
    const index = reactionData.index;
    const equip: Equip = data[index];

    showEquipment(equip, reaction);
  }
}

export function fowardOneItem(
  reaction: Discord.MessageReaction,
  user: Discord.User | Discord.PartialUser,
) {
  if (user.id === reactionData.userId && reactionData.index + 1 < reactionData.data.length) {
    reactionData.index++;

    const data = reactionData.data;
    const index = reactionData.index;
    const equip: Equip = data[index];

    showEquipment(equip, reaction);
  }
}

export function goToLastItem(
  reaction: Discord.MessageReaction,
  user: Discord.User | Discord.PartialUser,
) {
  if (user.id === reactionData.userId) {
    reactionData.index = reactionData.data.length - 1;

    const data = reactionData.data;
    const index = reactionData.index;
    const equip: Equip = data[index];

    showEquipment(equip, reaction);
  }
}

export function goToFirstItem(
  reaction: Discord.MessageReaction,
  user: Discord.User | Discord.PartialUser,
) {
  if (user.id === reactionData.userId) {
    reactionData.index = 0;

    const data = reactionData.data;
    const index = reactionData.index;
    const equip: Equip = data[index];

    showEquipment(equip, reaction);
  }
}

export function reactionHandle(
  reaction: Discord.MessageReaction,
  user: Discord.User | Discord.PartialUser,
) {
  switch (reaction.emoji.name) {
    case EmojiSymbols["⏪"]: {
      goToFirstItem(reaction, user);
      break;
    }
    case EmojiSymbols["◀"]: {
      backOneItem(reaction, user);
      break;
    }
    case EmojiSymbols["▶"]: {
      fowardOneItem(reaction, user);
      break;
    }
    case EmojiSymbols["⏩"]: {
      goToLastItem(reaction, user);
      break;
    }
  }
}

export function changeItemSelection(reaction: Discord.MessageReaction, user: Discord.User) {
  if (user.id === reactionData.userId) {
    reactionData.index++;

    const data = reactionData.data;
    const index = reactionData.index;
    const equip: Equip = data[index];

    showEquipment(equip, reaction);
  }
}

/**
 * Shows a list of equipments when user invoke
 */
export function showEquipment(equip: Equip, reaction: Discord.MessageReaction) {
  // equip is a shield
  if ("defence" in equip) {
    reaction.message.edit(
      `Id: ${(equip as Shield).id}\n` +
        `Name: ${(equip as Shield).name}\n` +
        `Defence: ${(equip as Shield).defence}\n` +
        `Price: ${(equip as Shield).price}\n\n`,
    );
    // Equip is a weapon
  } else if ("damage" in equip) {
    reaction.message.edit(
      `Id: ${(equip as Weapon).id}\n` +
        `Name: ${(equip as Weapon).name}\n` +
        `Damage: ${(equip as Weapon).damage}\n` +
        `Price: ${(equip as Weapon).price}\n\n`,
    );
  }
}
