import { AbilityEntity } from "../entities/ability-entity";
import { NotFoundError } from "../helpers/api-errors";
import { abilityRepository } from "../repositories/abilities-repository";

export class AbilityService {
  async getAll(): Promise<AbilityEntity[]> {
    const result = await abilityRepository.find({
      order: {
        id: "ASC",
      },
    });
    return result;
  }

  async getOne(ability: string): Promise<AbilityEntity> {
    let param: any = { name: ability };

    if (!isNaN(+ability)) {
      param = { id: Number(ability) };
    }

    const result = await abilityRepository.findOne({
      where: param,
      relations: { pokemons: true },
      order: {
        pokemons: { id: "ASC" },
      },
    });
    if (!result) {
      throw new NotFoundError("Ability not found");
    }

    return result;
  }
}
