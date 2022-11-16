import { Repository } from "typeorm";
import { TypeEntity } from "../../entities/type-entity";
import { NotFoundError } from "../../helpers/api-errors";

export class TypeService {
  private typeRepository: Repository<TypeEntity>;

  constructor(typeRepository: Repository<TypeEntity>) {
    this.typeRepository = typeRepository;
  }

  async getAll(): Promise<TypeEntity[]> {
    const result = await this.typeRepository.find({
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

    const result = await this.typeRepository.findOne({
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
