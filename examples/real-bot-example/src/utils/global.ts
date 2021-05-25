import { Reaction } from "../interfaces/reation";

/**
 * Character that must be tipped by the user when desire to talk with the bot
 */
export const PREFIX: string = "!";

/**
 * Maximum level of exploration
 */
export const EXPLORATION_MAX_LEVEL = 5;

export let reactionData: Reaction = {
  arrayType: null,
  data: null,
  index: 0,
  message: null,
  userId: null,
};
