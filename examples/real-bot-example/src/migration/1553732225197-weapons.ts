/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseEquips1553732225197 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Bronze Short Sword',6,6,1,3,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Blunt Sword',25,13,2,10,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Reaper Scythe',56,19,3,23,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Bone Dagger',100,25,4,40,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Carnwennan',156,31,5,63,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Firelord Keyblade',225,38,6,90,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Candy Sword',306,44,7,123,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Rose Sword',400,50,8,160,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Iron Scimitar',506,56,9,203,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Iron Rapier',625,63,10,250,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Iron Mace',756,69,11,303,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Iron Flail',900,75,12,360,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Emerald Sabre',1056,81,13,423,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Oblivion Blade',1225,88,14,490,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Behemoth Slayer',1406,94,15,563,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Hrunting',1600,100,16,640,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Overlord Blade',1806,106,17,723,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('The Devastator',2025,113,18,810,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Unicorn Blade',2256,119,19,903,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Fire Flail',2500,125,20,1000,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Acrimony',2756,131,21,1103,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Agony',3025,138,22,1210,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Azure Lightning',3306,144,23,1323,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Balance',3600,150,24,1440,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Blessed One',3906,156,25,1563,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Bone',4225,163,26,1690,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Bonnie’s Bounty',4556,169,27,1823,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Honor',4900,175,28,1960,'''weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Orc Cleaver',5256,181,29,2103,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Oracle',5625,188,30,2250,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Winter’s Bane',6006,194,31,2403,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Vengeance',6400,200,32,2560,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Torrent',6806,206,33,2723,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Zara’s Song',7225,213,34,2890,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Scorned Woman',7656,219,35,3063,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Obsession',8100,225,36,3240,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Misery Sword',8556,231,37,3423,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Quicksilver',9025,238,38,3610,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Queen’s Rage',9506,244,39,3803,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Severity',10000,250,40,4000,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Splinter',10506,256,41,4203,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Talon',11025,263,42,4410,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Swagger',11556,269,43,4623,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Tidal Wave',12100,275,44,4840,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Unrepentant',12656,281,45,5063,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Usurper’s Bane',13225,288,46,5290,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Valor',13806,294,47,5523,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Vapor',14400,300,48,5760,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Moonlight',15006,306,49,6003,'weapon');
   INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Restored Ward',15625,313,50,6250,'weapon');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
