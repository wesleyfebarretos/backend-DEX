import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error-middlewares";
import { AppDataSource } from "./data-source";

export async function setup(): Promise<Express> {
  await AppDataSource.initialize();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(routes);
  app.use(errorMiddleware);

  return app;
}
