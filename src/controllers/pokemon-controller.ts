import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PokemonService } from "../services/pokemon-service";

export class PokemonController {
  async getAll(req: Request, res: Response) {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 24;

    const result = await new PokemonService().getAll(offset, limit);

    res.json(result);
  }

  async getOne(req: Request, res: Response) {
    const { pokemon } = req.params;

    const result = await new PokemonService().getOne(pokemon);

    res.json(result);
  }

  async create(req: Request, res: Response) {
    const { name, abilities, types, sprites } = req.body;

    const result = await new PokemonService().create(
      name,
      abilities,
      types,
      sprites
    );

    res.status(StatusCodes.CREATED).json({
      id: result,
      message: `New pokemon ${name} created successfully`,
    });
  }

  async updateName(req: Request, res: Response) {
    const { name } = req.body;
    const { pokemon } = req.params;

    await new PokemonService().updateName(name, pokemon);

    res.json({ message: `Pokemon ${pokemon} successfully updated` });
  }

  async updateAbilities(req: Request, res: Response) {
    const { abilities } = req.body;
    const { pokemon } = req.params;

    await new PokemonService().updateAbilities(abilities, pokemon);

    res.json({ message: `Pokemon ${pokemon} successfully updated` });
  }

  async updateTypes(req: Request, res: Response) {
    const { types } = req.body;
    const { pokemon } = req.params;

    await new PokemonService().updateTypes(types, pokemon);

    res.json({ message: `Pokemon ${pokemon} successfully updated` });
  }

  async updateSprites(req: Request, res: Response) {
    const { sprites } = req.body;
    const { pokemon } = req.params;

    await new PokemonService().updateSprites(sprites, pokemon);

    res.json({ message: `Pokemon ${pokemon} successfully updated` });
  }

  async delete(req: Request, res: Response) {
    const { pokemon } = req.params;

    await new PokemonService().delete(pokemon);

    res.status(StatusCodes.NO_CONTENT).send();
  }
}
