/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { MigrationInterface, QueryRunner } from "typeorm";
import { ClassName, ClassNameEvolve } from "../enums/className";

export class Migration1550502138205 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `INSERT INTO heroclass (name, attackspeedbuff, damagebuff, expbuff, goldbuff, hpbuff, shieldbuff)
       SELECT '${ClassName.BEGGINNER}', 0, 0, 0, 0, 0, 0
       WHERE NOT EXISTS(SELECT name FROM heroclass WHERE name='${ClassName.BEGGINNER}');
       
       INSERT INTO heroclass (name, attackspeedbuff, damagebuff, expbuff, goldbuff, hpbuff, shieldbuff)
       SELECT '${ClassName.WARRIOR}', 0, 0, 0, 0, 5, 0
       WHERE NOT EXISTS(SELECT name FROM heroclass WHERE name='${ClassName.WARRIOR}');

       INSERT INTO heroclass (name, attackspeedbuff, damagebuff, expbuff, goldbuff, hpbuff, shieldbuff)
       SELECT '${ClassName.MAGE}', 0, 0, 3, 0, 0, 0
       WHERE NOT EXISTS(SELECT name FROM heroclass WHERE name='${ClassName.MAGE}');

       INSERT INTO heroclass (name, attackspeedbuff, damagebuff, expbuff, goldbuff, hpbuff, shieldbuff)
       SELECT '${ClassName.THIEF}', 0, 0, 0, 1, 0, 0
       WHERE NOT EXISTS(SELECT name FROM heroclass WHERE name='${ClassName.THIEF}');

       INSERT INTO heroclass (name, attackspeedbuff, damagebuff, expbuff, goldbuff, hpbuff, shieldbuff)
       SELECT '${ClassName.ARCHER}', 0, 0, 0, 0, 5, 0
       WHERE NOT EXISTS(SELECT name FROM heroclass WHERE name='${ClassName.ARCHER}');

       INSERT INTO heroclass (name, attackspeedbuff, damagebuff, expbuff, goldbuff, hpbuff, shieldbuff)
       SELECT '${ClassNameEvolve.KNIGHT}', 0, 0, 0, 1, 10, 0
       WHERE NOT EXISTS(SELECT name FROM heroclass WHERE name='${ClassNameEvolve.KNIGHT}');

       INSERT INTO heroclass (name, attackspeedbuff, damagebuff, expbuff, goldbuff, hpbuff, shieldbuff)
       SELECT '${ClassNameEvolve.PALADIN}', 0, 5, 0, 1, 5, 0
       WHERE NOT EXISTS(SELECT name FROM heroclass WHERE name='${ClassNameEvolve.PALADIN}');

       INSERT INTO heroclass (name, attackspeedbuff, damagebuff, expbuff, goldbuff, hpbuff, shieldbuff)
       SELECT '${ClassNameEvolve.NECRO}', 0, 0, 0, 0, 5, 0
       WHERE NOT EXISTS(SELECT name FROM heroclass WHERE name='${ClassNameEvolve.NECRO}');

       INSERT INTO heroclass (name, attackspeedbuff, damagebuff, expbuff, goldbuff, hpbuff, shieldbuff)
       SELECT '${ClassNameEvolve.LADIN}', 0, 0, 0, 1, 5, 0
       WHERE NOT EXISTS(SELECT name FROM heroclass WHERE name='${ClassNameEvolve.LADIN}');

       INSERT INTO heroclass (name, attackspeedbuff, damagebuff, expbuff, goldbuff, hpbuff, shieldbuff)
       SELECT '${ClassNameEvolve.NINJA}', 0, 5, 0, 1, 0, 0
       WHERE NOT EXISTS(SELECT name FROM heroclass WHERE name='${ClassNameEvolve.NINJA}');

       INSERT INTO heroclass (name, attackspeedbuff, damagebuff, expbuff, goldbuff, hpbuff, shieldbuff)
       SELECT '${ClassNameEvolve.HUNTER}', 1, 10, 0, 1, 0, 0
       WHERE NOT EXISTS(SELECT name FROM heroclass WHERE name='${ClassNameEvolve.HUNTER}');

       INSERT INTO heroclass (name, attackspeedbuff, damagebuff, expbuff, goldbuff, hpbuff, shieldbuff)
       SELECT '${ClassNameEvolve.TRICKSTER}', 1, 5, 0, 1, 5, 0
       WHERE NOT EXISTS(SELECT name FROM heroclass WHERE name='${ClassNameEvolve.TRICKSTER}');
       `,
    );
  }

  public async down(_: QueryRunner): Promise<any> {}
}
