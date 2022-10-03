import { Router } from "express";
import { AllPokemonsController } from "./controllers/AllPokemonsController";
import { PokemonController } from "./controllers/PokemonController";

const routes = Router();

routes.get("/pokemon", new AllPokemonsController().get);
routes.get("/pokemon/:pokemon", new PokemonController().get);

export default routes;
