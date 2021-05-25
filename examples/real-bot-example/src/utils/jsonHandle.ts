import * as proficienceLevels from "../../data/proficienceLevel.json";
import * as levels from "../../data/levels.json";
import { Level } from "../interfaces/level.js";

interface GenericJson<T> {
  [value: string]: T;
}

/**
 * Class with static method for search of data in json files
 */
export class JsonHandle {
  /**
   * Based in a json file and a data indetifier, get the data and returns it
   * @param imp import of data. I.e: import * as weapons from "./weapon.json"
   * @param dataId identifier of the data. i.e:
   *
   * file path: "./test.json"
   * ```
   * {
   *  "1": {
   *    "value": "example"
   *   }
   * }
   *
   * export type Test = {
   *  value: string
   * }
   *
   * //Import the file
   * import * as testFile from "./test.json";
   *
   * const data = genericDataGetById<Test>(testFile, 1);
   *
   * data = {value: example};
   * ```
   */
  public static genericDataGetById<T>(imp: GenericJson<T>, dataId: number): T {
    const data: T = imp[dataId];
    if (data !== undefined) {
      if ("id" in data) {
        data["id"] = dataId;
      }
      return data;
    }
    console.error(`${dataId} do not correpond to any ${typeof data} id`);
    throw new Error(`${typeof data} not exists`);
  }

  public static getProficienceById(proficienceId: number): Level {
    const data = JsonHandle.genericDataGetById<Level>(proficienceLevels, proficienceId);
    data.value = proficienceId;
    return data;
  }

  public static getLevelById(level: number): Level {
    const data = JsonHandle.genericDataGetById<Level>(levels, level);
    data.value = level;
    return data;
  }
}
