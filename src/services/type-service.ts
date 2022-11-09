import { TypeEntity } from "../entities/type-entity";
import { NotFoundError } from "../helpers/api-errors";
import { typeRepository } from "../repositories/types-repository";

export class TypeService {
  async getAll(): Promise<TypeEntity[]> {
    const result = await typeRepository.find({
      order: {
        id: "ASC",
      },
    });
    return result;
  }

  async getOne(type: string): Promise<TypeEntity> {
    let param: any = { name: type };

    if (!isNaN(+type)) {
      param = { id: Number(type) };
    }

    const result = await typeRepository.findOne({
      where: param,
      relations: { pokemons: true },
      order: {
        pokemons: { id: "ASC" },
      },
    });
    if (!result) {
      throw new NotFoundError("Type not found");
    }

    return result;
  }
}
