import { Request, Response } from "express";
import { PokemonService } from "../services/pokemon-service";

export class PokemonController {
  async getAll(req: Request, res: Response) {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 24;

    const result = await new PokemonService().getAll(offset, limit);

    res.json(result);
  }

  async getOne(req: Request, res: Response) {
    const pokemon: any = req.params.pokemon;

    const result = await new PokemonService().getOne(pokemon);

    res.json(result);
  }
}
