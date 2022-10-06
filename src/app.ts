import "express-async-errors";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { AppDataSource } from "./data-source";
import { errorMiddleware } from "./middlewares/error";

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(routes);
  app.use(errorMiddleware);

  app.listen("3000", () => {
    console.log("running on port 3000");
  });
});
