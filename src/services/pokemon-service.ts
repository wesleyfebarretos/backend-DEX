import { IsNull } from "typeorm";
import { AppDataSource } from "../data-source";
import { PokemonEntity } from "../entities/pokemon-entity";
import { SpriteEntity } from "../entities/sprite-entity";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";
import { abilityRepository } from "../repositories/abilities-repository";
import { pokemonRepository } from "../repositories/pokemon-repository";
import { spriteRepository } from "../repositories/sprite-reposository";
import { typeRepository } from "../repositories/types-repository";

export interface PaginateObject<T> {
  next: string;
  results: Array<T>;
}

interface QueryParameter {
  id?: number;
  name?: string;
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
      next: `http://localhost:3000/pokemon?offset=${
        offset + limit
      }&limit=${limit}`,
      results: result,
    };
  }

  async getOne(pokemon: string): Promise<PokemonEntity> {
    const query = this.buildFindPokemonQuery(pokemon);

    const result = await pokemonRepository.findOne({
      where: query,
      relations: { abilities: true, types: true, sprites: true },
    });
    if (!result) {
      throw new NotFoundError("Pokemon not found");
    }

    return result;
  }

  async create(
    name: string,
    abilities: number[],
    types: number[],
    sprites: SpriteEntity[]
  ): Promise<Number> {
    const pokemon = await pokemonRepository.findOne({
      where: { name: name },
      relations: { abilities: true, types: true, sprites: true },
    });

    if (pokemon) {
      throw new BadRequestError(`Pokemon ${pokemon.name} already exist`);
    }

    if (abilities.length == 0 || abilities.length > 3) {
      throw new BadRequestError(
        `Add the abilities correctly, they cannot be equal to 0 or greater than 3`
      );
    }
    if (types.length == 0 || types.length > 2) {
      throw new BadRequestError(
        `Add the types correctly, they cannot be equal to 0 or greater than 2`
      );
    }

    if (sprites.length == 0 || sprites.length > 4) {
      throw new BadRequestError(
        `Add the sprites correctly, they cannot be equal to 0 or greater than 4`
      );
    }

    for (let sprite of sprites) {
      if (
        sprite.name != "front_default" &&
        sprite.name != "back_default" &&
        sprite.name != "back_shiny" &&
        sprite.name != "front_shiny"
      ) {
        throw new BadRequestError(
          `sprite.name only accepts values like: front_shiny/ back_shiny/ front_default/ back_default`
        );
      }

      const imgExist = await spriteRepository.findOne({
        where: {
          img: sprite.img,
        },
      });

      if (imgExist) {
        throw new BadRequestError(`img: ${sprite.img} already exist`);
      }
    }

    const allAbilities: any = [];

    for (let ability of abilities) {
      const reqAbilities = await abilityRepository.findOneBy({ id: ability });
      allAbilities.push(reqAbilities);
    }

    const allTypes: any = [];

    for (let type of types) {
      const reqTypes = await typeRepository.findOneBy({ id: type });
      allTypes.push(reqTypes);
    }

    const newPokemon = pokemonRepository.create({
      name,
      abilities: allAbilities,
      types: allTypes,
      sprites,
    });

    const savedPokemon = await pokemonRepository.save(newPokemon);
    return savedPokemon.id;
  }

  async updateName(name: string, pokemon: string) {
    const query = this.buildFindPokemonQuery(pokemon);
    await this.findPokemonByNameOrId(query);

    await pokemonRepository.update(query, {
      name: name,
    });
  }

  async updateAbilities(abilities: number[], pokemon: string) {
    const query = this.buildFindPokemonQuery(pokemon);
    const result = await this.findPokemonByNameOrId(query);

    const allAbilities: any = [];
    for (let ability of abilities) {
      const reqAbilities = await abilityRepository.findOneBy({ id: ability });
      allAbilities.push(reqAbilities);
    }

    result.abilities = allAbilities;

    await pokemonRepository.save(result);
  }

  async updateTypes(types: number[], pokemon: string) {
    const query = this.buildFindPokemonQuery(pokemon);
    const result = await this.findPokemonByNameOrId(query);

    const allTypes: any = [];
    for (let type of types) {
      const reqTypes = await typeRepository.findOneBy({ id: type });
      allTypes.push(reqTypes);
    }

    result.types = allTypes;

    await pokemonRepository.save(result);
  }

  async updateSprites(sprites: SpriteEntity[], pokemon: string) {
    const query = this.buildFindPokemonQuery(pokemon);
    const result = await this.findPokemonByNameOrId(query);

    for (let sprite of sprites) {
      const checkSprite = await spriteRepository.findOneBy({ img: sprite.img });

      if (checkSprite) {
        throw new BadRequestError("IMG already exist");
      }
    }

    result.sprites = sprites;

    await pokemonRepository.save(result);
    await spriteRepository.delete({ pokemon: IsNull() });
  }

  async delete(pokemon: string) {
    const query = this.buildFindPokemonQuery(pokemon);
    await this.findPokemonByNameOrId(query);

    await pokemonRepository.delete(query);
  }

  buildFindPokemonQuery(pokemon: string): QueryParameter {
    if (!isNaN(+pokemon)) {
      return { id: Number(pokemon) };
    }

    return { name: pokemon };
  }

  async findPokemonByNameOrId(query: QueryParameter): Promise<PokemonEntity> {
    const result = await pokemonRepository.findOneBy(query);

    if (!result) {
      throw new NotFoundError("Pokemon not found");
    }

    return result;
  }
}
