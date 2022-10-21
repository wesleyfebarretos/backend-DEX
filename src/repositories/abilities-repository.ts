import { AppDataSource } from "../data-source";
import { AbilityEntity } from "../entities/ability-entity";

export const abilitiesRepository = AppDataSource.getRepository(AbilityEntity);
