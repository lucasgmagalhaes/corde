import { Repository, EntityRepository } from "typeorm";
import { dbConnection } from "../../dbconn";
import { InventoryEquip } from "../entity/inventoryEquip";

@EntityRepository(InventoryEquip)
export class InventoryItemRepository extends Repository<InventoryEquip> {}

export function getInventoryEquipRepository(): InventoryItemRepository {
  return dbConnection.getCustomRepository(InventoryItemRepository);
}
