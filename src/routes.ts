import { Router } from "express";
import { PokemonController } from "./controllers/pokemon-controller";

const routes = Router();
const pokemonController = new PokemonController();

routes.get("/pokemons", pokemonController.getAll);
routes.get("/pokemon/:pokemon", pokemonController.getOne);

export default routes;
