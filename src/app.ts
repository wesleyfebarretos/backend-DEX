import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error-middlewares";
import { AppDataSource } from "./data-source";
import { pokemonRouter } from "./router/pokemon-router";
import { typeRouter } from "./router/type-router";
import { abilityRouter } from "./router/ability-router";

export async function setup(): Promise<Express> {
  await AppDataSource.initialize();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/pokemon", pokemonRouter);
  app.use("/type", typeRouter);
  app.use("/ability", abilityRouter);
  app.use(errorMiddleware);

  return app;
}
