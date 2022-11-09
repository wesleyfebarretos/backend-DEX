import { Router } from "express";
import { PokemonController } from "../controllers/pokemon-controller";

export const pokemonRouter = Router();
const pokemonController = new PokemonController();

pokemonRouter.get("", pokemonController.getAll);
pokemonRouter.get("/:pokemon", pokemonController.getOne);
pokemonRouter.post("", pokemonController.create);
pokemonRouter.delete("/:pokemon", pokemonController.delete);
pokemonRouter.put("/:pokemon/name", pokemonController.updateName);
pokemonRouter.put("/:pokemon/abilities", pokemonController.updateAbilities);
pokemonRouter.put("/:pokemon/types", pokemonController.updateTypes);
pokemonRouter.put("/:pokemon/sprites", pokemonController.updateSprites);
