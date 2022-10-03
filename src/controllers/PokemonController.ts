import { Request, Response } from "express";
import axios from "axios";

export class PokemonController {
  async get(req: Request, res: Response) {
    try {
      const result = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${req.params.pokemon}`
      );

      res.send(result.data);
    } catch (error) {
      res
        .status(404)
        .json({ message: `Pokemon ${req.params.pokemon} does not exist` });
    }
  }
}
