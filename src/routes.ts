import { Router } from "express";
import { PokemonController } from "./controllers/pokemon-controller";

const routes = Router();
const pokemonController = new PokemonController();

routes.get("/pokemons", pokemonController.getAll);
routes.get("/pokemon/:pokemon", pokemonController.getOne);
routes.get("/types", pokemonController.getTypes);
routes.get("/types/:type", pokemonController.getOneType);
routes.get("/abilities", pokemonController.getAbilities);
routes.get("/abilities/:ability", pokemonController.getOneAbility);
routes.post("/newpokemon", pokemonController.createNewPokemon);
routes.delete("/delete/:id", pokemonController.deletePokemon);
routes.put("/update/name/:pokemon", pokemonController.updatePokemonName);
routes.put(
  "/update/abilities/:pokemon",
  pokemonController.updatePokemonAbilities
);
routes.put("/update/types/:pokemon", pokemonController.updatePokemonType);
routes.put("/update/sprites/:pokemon", pokemonController.updatePokemonSprite);

export default routes;
