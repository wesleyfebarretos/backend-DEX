import { Router } from "express";
import { AllPokemonsController } from "./controllers/AllPokemonsController";
import { PokemonController } from "./controllers/PokemonController";
import { BadRequestError } from "./helpers/api-errors";

const routes = Router();

routes.get("/pokemons", new AllPokemonsController().get);
routes.get("/pokemon/:pokemon", new PokemonController().get);

export default routes;
