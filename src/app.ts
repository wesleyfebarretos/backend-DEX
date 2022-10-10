import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";
import routes from "./routes";
import { AppDataSource } from "./data-source";
import { errorMiddleware } from "./middlewares/error-middlewares";

export async function setup(): Promise<Express> {
  await AppDataSource.initialize();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(routes);
  app.use(errorMiddleware);

  return app;
}
setup().then((app) =>
  app.listen("3000", () => {
    console.log("running on port 3000");
  })
);
