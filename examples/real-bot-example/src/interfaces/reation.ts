import * as Discord from "discord.js";
import { itemType } from "../enums/itemType";
import { Equip } from "../entity/equip";

/**
 * Store the list of shields/weapons that the user is seeing to buy in "shop" command
 * @property userId - id of the user who called the command "shop"
 * @property data - array of elements that the user will pass
 * @property index - actual position of the array
 * @property message - information of the message sent by the bot listing the array
 * @property
 */
export interface Reaction {
  userId: string;
  data: Equip[];
  index: number;
  message: Discord.Message;
  arrayType: itemType;
}
