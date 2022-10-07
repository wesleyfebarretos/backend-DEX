import { Request, Response } from "express";
import { off } from "process";
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
    const next = limit
      ? `http://localhost:3000/pokemons?offset=${offset + limit}&limit=${limit}`
      : null;

    res.json({
      next: next,
      results: result,
    });
  }
}
