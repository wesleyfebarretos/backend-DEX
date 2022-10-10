import { AppDataSource } from "../data-source";
import { PokemonEntity } from "../entities/pokemon-entity";
import { NotFoundError } from "../helpers/api-errors";
interface PaginateObject<T> {
  next: string;
  results: Array<T>;
}
export class PokemonService {
  async getAll(
    offset: number,
    limit: number
  ): Promise<PaginateObject<PokemonEntity>> {
    const result = await AppDataSource.getRepository(PokemonEntity).find({
      order: {
        id: "ASC",
      },
      relations: { abilities: true, types: true, sprites: true },
      skip: offset,
      take: limit,
    });

    return {
      next: `http://localhost:3000/pokemons?offset=${
        offset + limit
      }&limit=${limit}`,
      results: result,
    };
  }

  async getOne(pokemon: string): Promise<PokemonEntity> {
    let query: any = { name: pokemon };

    if (!isNaN(+pokemon)) {
      query = { id: Number(pokemon) };
    }

    const result = await AppDataSource.getRepository(PokemonEntity).findOne({
      where: query,
      relations: { abilities: true, types: true, sprites: true },
    });
    if (!result) {
      throw new NotFoundError("Pokemon does not exist");
    }

    return result;
  }
}
