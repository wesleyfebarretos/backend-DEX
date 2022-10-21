import { IsNull } from "typeorm";
import { AppDataSource } from "../data-source";
import { AbilityEntity } from "../entities/ability-entity";
import { PokemonEntity } from "../entities/pokemon-entity";
import { SpriteEntity } from "../entities/sprite-entity";
import { TypeEntity } from "../entities/type-entity";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";
import { abilitiesRepository } from "../repositories/abilities-repository";
import { pokemonRepository } from "../repositories/pokemon-repository";
import { spriteRepository } from "../repositories/sprite-reposository";
import { typeRepository } from "../repositories/types-repository";

export interface PaginateObject<T> {
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

  async getTypes(): Promise<TypeEntity[]> {
    const result = await AppDataSource.getRepository(TypeEntity).find({
      order: {
        id: "ASC",
      },
    });
    return result;
  }

  async getOneType(type: string): Promise<TypeEntity> {
    let param: any = { name: type };

    if (!isNaN(+type)) {
      param = { id: Number(type) };
    }

    const result = await AppDataSource.getRepository(TypeEntity).findOne({
      where: param,
      relations: { pokemons: true },
      order: {
        pokemons: { id: "ASC" },
      },
    });
    if (!result) {
      throw new NotFoundError("Type does not exist");
    }

    return result;
  }

  async getAbilities(): Promise<AbilityEntity[]> {
    const result = await AppDataSource.getRepository(AbilityEntity).find({
      order: {
        id: "ASC",
      },
    });
    return result;
  }

  async getOneAbility(ability: string): Promise<AbilityEntity> {
    let param: any = { name: ability };

    if (!isNaN(+ability)) {
      param = { id: Number(ability) };
    }

    const result = await AppDataSource.getRepository(AbilityEntity).findOne({
      where: param,
      relations: { pokemons: true },
      order: {
        pokemons: { id: "ASC" },
      },
    });
    if (!result) {
      throw new NotFoundError("Ability does not exist");
    }

    return result;
  }

  async createNewPokemon(
    name: string,
    abilities: number[],
    types: number[],
    sprites: SpriteEntity[]
  ): Promise<Number> {
    const pokemon = await AppDataSource.getRepository(PokemonEntity).findOne({
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

      const imgExist = await AppDataSource.getRepository(SpriteEntity).findOne({
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
      const reqAbilities = await abilitiesRepository.findOneBy({ id: ability });
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

  async deletePokemon(id: string): Promise<Number | null> {
    const param = Number(id);
    const pokemon = await pokemonRepository.findOneBy({
      id: param,
    });

    if (!pokemon) {
      throw new BadRequestError(`pokemon ID: ${param} does not exist`);
    }

    await pokemonRepository.delete(param);
    return param;
  }

  async updatePokemonName(name: string, pokemonParam: string) {
    let query: any = { name: pokemonParam };

    if (!isNaN(+pokemonParam)) {
      query = { id: Number(pokemonParam) };
    }

    const pokemon = await pokemonRepository.findOneBy(query);

    if (!pokemon) {
      throw new BadRequestError(
        "pokemon cannot be updated, because it does not exist"
      );
    }
    await pokemonRepository.update(query, {
      name: name,
    });
  }

  async updatePokemonAbilities(abilities: number[], pokemonParam: string) {
    let query: any = { name: pokemonParam };

    if (!isNaN(+pokemonParam)) {
      query = { id: Number(pokemonParam) };
    }

    const pokemon = await pokemonRepository.findOneBy(query);

    if (!pokemon) {
      throw new BadRequestError(
        "pokemon cannot be updated, because it does not exist"
      );
    }

    const allAbilities: any = [];
    for (let ability of abilities) {
      const reqAbilities = await abilitiesRepository.findOneBy({ id: ability });
      allAbilities.push(reqAbilities);
    }

    pokemon.abilities = allAbilities;

    await pokemonRepository.save(pokemon);
  }

  async updatePokemonTypes(types: number[], pokemonParam: string) {
    let query: any = { name: pokemonParam };

    if (!isNaN(+pokemonParam)) {
      query = { id: Number(pokemonParam) };
    }

    const pokemon = await pokemonRepository.findOneBy(query);

    if (!pokemon) {
      throw new BadRequestError(
        "pokemon cannot be updated, because it does not exist"
      );
    }

    const allTypes: any = [];
    for (let type of types) {
      const reqTypes = await typeRepository.findOneBy({ id: type });
      allTypes.push(reqTypes);
    }

    pokemon.types = allTypes;

    await pokemonRepository.save(pokemon);
  }

  async updatePokemonSprites(sprites: SpriteEntity[], pokemonParam: string) {
    let query: any = { name: pokemonParam };

    if (!isNaN(+pokemonParam)) {
      query = { id: Number(pokemonParam) };
    }

    const pokemon = await pokemonRepository.findOneBy(query);

    if (!pokemon) {
      throw new BadRequestError(
        "pokemon cannot be updated, because it does not exist"
      );
    }

    for (let sprite of sprites) {
      const checkSprite = await spriteRepository.findOneBy({ img: sprite.img });

      if (checkSprite) {
        throw new BadRequestError("IMG already exist");
      }
    }

    pokemon.sprites = sprites;

    await pokemonRepository.save(pokemon);
    await spriteRepository.delete({ pokemon: IsNull() });
  }
}
