/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1554586471001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Stolen Fence',9,6,1,4,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Pan Lid',38,13,2,15,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Black Phoenix Shield',84,19,3,34,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Mithril Buckler',150,25,4,60,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Steel Shield',234,31,5,94,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Adamantium Shield',338,38,6,135,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Skull Shield',459,44,7,184,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Wooden Legend Shield',600,50,8,240,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Silver Legend Shield',759,56,9,304,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Adamantium Legend Shield',938,63,10,375,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Steel Ancient Shield',1134,69,11,454,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Gold Ancient Shield',1350,75,12,540,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Steel Aquila Shield',1584,81,13,634,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Silver Aquila Shield',1838,88,14,735,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Bronze Kalkan',2109,94,15,844,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Silver Kalkan',2400,100,16,960,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Gold Kalkan',2709,106,17,1084,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Crossheider',3038,113,18,1215,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Deimos Warrior Shield',3384,119,19,1354,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Timeless Kite Shield',3750,125,20,1500,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Blue Hoflon',4134,131,21,1654,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Battle Shield',4538,138,22,1815,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Triangular Shield',4959,144,23,1984,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Timeless List',5400,150,24,2160,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Deimos Shadow Shield',5859,156,25,2344,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Deimos Sage Shield',6338,163,26,2535,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Timeless Prelude',6834,169,27,2734,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Esther Shield',7350,175,28,2940,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Rattan',7884,181,29,3154,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Leather lamellar',8438,188,30,3375,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Maille',9009,194,31,3604,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Lost Paradise',9600,200,32,3840,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Blind Hatred',10209,206,33,4084,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Reign Maker',10838,213,34,4335,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Wind''s Carapace',11484,219,35,4594,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Defiled Redwood Light Shield',12150,225,36,4860,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Vicious Armament',12834,231,37,5134,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('The Sentinel',13538,238,38,5415,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Brutality Bastion',14259,244,39,5704,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Shepherd',15000,250,40,6000,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Unholy Aegis',15759,256,41,6304,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Blackout',16538,263,42,6615,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Mercy',17334,269,43,6934,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Eulogy',18150,275,44,7260,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Fragile Iron Shield',18984,281,45,7594,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Warmonger',19838,288,46,7935,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Peace Maker',20709,294,47,8284,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Blind Hatred',21600,300,48,8640,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Promised Tower Shield',22509,306,49,9004,'shield');
         INSERT INTO equip(Name,Price,Damage,Level,SellPrice,type) VALUES ('Crazed Warpwood Keeper',23438,313,50,9375,'shield');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
