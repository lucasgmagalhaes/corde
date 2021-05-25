import * as Discord from "discord.js";
import { reactionData } from "../utils/global";
import { HeroRepository } from "../repositories/heroRepository";
import { dbConnection } from "../../dbconn";
import { Equip } from "../entity/equip";
import { InventoryEquip } from "../entity/inventoryEquip";
import { getInventoryEquipRepository } from "../repositories/inventoryItemRepository";

/**
 * Buy a equip from store
 * @since 0.1
 * @param msg message caller
 * @param equipId id of the equip that user wants to buy
 */
export async function buy(msg: Discord.Message, equipId: string) {
  if (equipId === undefined) {
    msg.channel.send("How do you expect to buy something without informn what to buy ?");
    return;
  }

  if (reactionData.data === null) {
    msg.channel.send("I think that the shop is closed. Open it again");
    return;
  }

  if (typeof equipId !== "number") {
    msg.channel.send("Well... I don't think that it is a equip id");
    return;
  }

  const heroRepository = dbConnection.getCustomRepository(HeroRepository);

  try {
    const hero = await heroRepository.findbyId(msg.author.id);

    if (hero === null) {
      msg.channel.send("You can not buy an equip because you don't have a hero");
      return;
    }

    const equipToBuy: Equip = reactionData.data.find(
      (equip) => equip.id === Number.parseInt(equipId),
    );

    if (equipToBuy.price > hero.gold) {
      msg.channel.send("NOT ENOUGH CASH!");
      return;
    }

    let equipType = "";

    if ("damage" in equipToBuy) {
      hero.weapon = equipToBuy;
      equipType = "weapon";
    } else if ("shield" in equipToBuy) {
      hero.shield = equipToBuy;
      equipType = "shield";
    }

    hero.gold -= equipToBuy.price;

    const heroInventory = await hero.inventoryItens;

    const inventoryItem = new InventoryEquip();
    inventoryItem.equip = Promise.resolve(equipToBuy);
    inventoryItem.hero = Promise.resolve(hero);

    const inventoryItemRepository = getInventoryEquipRepository();
    await inventoryItemRepository.create(inventoryItem);

    heroInventory.push(inventoryItem);

    try {
      await heroRepository.updateHero(hero);
      msg.channel.send(
        "Congratualitions! You now are equiping " + equipToBuy.name + " " + equipType,
      );
    } catch (error) {
      console.error(error);
      msg.channel.send("I'm so sorry in say that, but we found a when delivering your equip");
    }
  } catch (error) {
    msg.channel.send(error);
  }
}
