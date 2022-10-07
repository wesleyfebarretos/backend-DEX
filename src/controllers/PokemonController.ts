import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { PokemonEntity } from "../entities/pokemon";
import { NotFoundError } from "../helpers/api-errors";

export class PokemonController {
  async get(req: Request, res: Response) {
    let query: any = { name: req.params.pokemon };

    if (!isNaN(+req.params.pokemon)) {
      query = { id: Number(req.params.pokemon) };
    }

    const result = await AppDataSource.getRepository(PokemonEntity).find({
      where: query,
      relations: { abilities: true, types: true, sprites: true },
    });
    if (!result.length) {
      throw new NotFoundError("Pokemon does not exist");
    }
    res.send(result);
  }
}
