import express from "express";
import cors from "cors";
import routes from "./routes";
import { AppDataSource } from "./data-source";

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(routes);

  app.listen("3000", () => {
    console.log("running on port 3000");
  });
});
