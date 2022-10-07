import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { PokemonEntity } from "../entities/pokemon";

export class AllPokemonsController {
  async get(req: Request, res: Response) {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 24;
    const result = await AppDataSource.getRepository(PokemonEntity).find({
      order: {
        id: "ASC",
      },
      relations: { abilities: true, types: true, sprites: true },
      skip: offset,
      take: limit,
    });
    const next = offset
      ? `http://localhost:3000/pokemons?offset=${
          offset + result.length
        }&limit=${limit}`
      : null;

    res.send(
      JSON.parse(
        JSON.stringify({
          next: next,
          results: result,
        })
      )
    );
  }
}
