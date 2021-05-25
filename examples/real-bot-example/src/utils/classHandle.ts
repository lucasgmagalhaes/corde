import { ClassName } from "../enums/className";

/**
 * Inform the HeroClass of an string
 * @param className string name of a class
 */
export function getHeroClass(className: string): ClassName {
  if (className.trim().toUpperCase() === ClassName.ARCHER.toUpperCase()) return ClassName.ARCHER;
  else if (className.trim().toUpperCase() === ClassName.MAGE.toUpperCase()) return ClassName.MAGE;
  else if (className.trim().toUpperCase() === ClassName.THIEF.toUpperCase()) return ClassName.THIEF;
  else if (className.trim().toUpperCase() === ClassName.WARRIOR.toUpperCase())
    return ClassName.WARRIOR;
  return null;
}
