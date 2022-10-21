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
    const { pokemon }: any = req.params;

    const result = await new PokemonService().getOne(pokemon);

    res.json(result);
  }

  async getTypes(req: Request, res: Response) {
    const result = await new PokemonService().getTypes();

    res.json(result);
  }

  async getOneType(req: Request, res: Response) {
    const { type } = req.params;

    const result = await new PokemonService().getOneType(type);

    res.json(result);
  }

  async getAbilities(req: Request, res: Response) {
    const result = await new PokemonService().getAbilities();
    res.json(result);
  }

  async getOneAbility(req: Request, res: Response) {
    const { ability } = req.params;

    const result = await new PokemonService().getOneAbility(ability);
    res.json(result);
  }

  async createNewPokemon(req: Request, res: Response) {
    const { name } = req.body;
    const { abilities } = req.body;
    const { types } = req.body;
    const { sprites } = req.body;

    const result = await new PokemonService().createNewPokemon(
      name,
      abilities,
      types,
      sprites
    );

    res.status(201).json({
      id: result,
      message: `New pokemon ${name} created successfully`,
    });
  }

  async deletePokemon(req: Request, res: Response) {
    const { id } = req.params;

    await new PokemonService().deletePokemon(id);

    res.status(204).json();
  }

  async updatePokemonName(req: Request, res: Response) {
    const { name } = req.body;
    const { pokemon }: any = req.params;

    await new PokemonService().updatePokemonName(name, pokemon);

    res.json({ message: `Pokemon ${pokemon} successfully updated` });
  }

  async updatePokemonAbilities(req: Request, res: Response) {
    const { abilities } = req.body;
    const { pokemon }: any = req.params;

    await new PokemonService().updatePokemonAbilities(abilities, pokemon);

    res.json({ message: `Pokemon ${pokemon} successfully updated` });
  }

  async updatePokemonType(req: Request, res: Response) {
    const { types } = req.body;
    const { pokemon }: any = req.params;

    await new PokemonService().updatePokemonTypes(types, pokemon);

    res.json({ message: `Pokemon ${pokemon} successfully updated` });
  }

  async updatePokemonSprite(req: Request, res: Response) {
    const { sprites } = req.body;
    const { pokemon }: any = req.params;

    await new PokemonService().updatePokemonSprites(sprites, pokemon);

    res.json({ message: `Pokemon ${pokemon} successfully updated` });
  }
}
