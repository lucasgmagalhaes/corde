import { itemType } from "../enums/itemType";

/**
 * Inform the HeroClass of an string
 * @param TypeName string name of a class
 */
export function getItemType(TypeName: string): itemType {
  if (TypeName.trim().toUpperCase() === itemType.WEAPON.toUpperCase()) return itemType.WEAPON;
  else if (TypeName.trim().toUpperCase() === itemType.SHIELD.toUpperCase()) return itemType.SHIELD;
  return undefined;
}
