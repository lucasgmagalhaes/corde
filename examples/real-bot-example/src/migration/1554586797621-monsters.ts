/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1554586797621 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Slime',1,5,1,30,1,1,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Fang Rat',2,6,2,33,2,3,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Harpy',3,7,3,36,3,5,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Goblin',4,8,4,39,4,7,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Zombie',5,9,5,42,5,9,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Wisp',6,10,6,45,6,11,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Scout',7,11,7,48,7,13,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Rat',8,12,8,51,8,15,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Driller',9,13,9,54,9,17,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Sand Viper',10,14,10,57,10,19,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Earthsoul',11,18,13,70,12,22,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Horror Box',12,22,16,74,14,25,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Eyeant',13,26,19,78,16,28,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Watchman of Darkness',14,30,22,82,18,31,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Fire-breathing Rat',15,34,25,86,20,34,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Mandrake',16,38,28,90,22,37,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Graveyard Watchman',17,42,31,94,24,40,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Deathviper',18,46,34,98,26,43,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Seeker',19,50,37,102,28,46,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Devil Plant',20,54,40,106,30,49,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Flame Wolf',21,59,44,111,32,53,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Blue Gel',22,64,48,116,34,57,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Crocodino',23,69,52,121,36,61,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Demon Soul',24,74,56,126,38,65,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('High Driller',25,79,60,131,40,69,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Stray Metaan',26,84,64,136,42,73,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Looter',27,89,68,141,44,77,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Sprite',28,94,72,146,46,81,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Forest Watchman',29,99,76,151,48,85,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Gobleader',30,104,80,156,50,89,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Mage Goblin',31,109,84,161,52,93,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Goblin Follower',32,114,88,166,54,97,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Nymph',33,119,92,171,56,101,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Ice Wolf',34,124,96,176,58,105,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Wyvern',35,129,100,181,60,109,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Death Box',36,134,104,186,62,113,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('DeathGator',37,139,108,191,64,117,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Laprox',38,144,112,196,66,121,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Hell Messenger',39,149,116,201,68,125,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Jumper',40,154,120,206,70,129,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Drillkiller',41,159,124,211,72,133,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Mob Soldier',42,164,128,216,74,137,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Gang Machine',43,169,132,221,76,141,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Death Armor',44,174,136,226,78,145,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Onigami',45,179,140,231,80,149,null,0);
        INSERT INTO monster(name,level,damage,defence,hp,givedxp,givedgold,idequipDrop,equipDropChance) VALUES ('Inugami',46,184,144,236,82,153,null,0);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
