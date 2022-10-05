import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { PokemonEntity } from "../entities/pokemon";

export class PokemonController {
  async get(req: Request, res: Response) {
    let query: any = { name: req.params.pokemon };

    if (!isNaN(+req.params.pokemon)) {
      query = { id: Number(req.params.pokemon) };
    }
    try {
      const result = await AppDataSource.getRepository(PokemonEntity).find({
        where: query,
        relations: { abilities: true, types: true, sprites: true },
      });
      res.send(result);
    } catch (error) {
      res
        .status(404)
        .json({ message: `Pokemon ${req.params.pokemon} does not exist` });
    }
  }
}
