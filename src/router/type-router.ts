import { Router } from "express";
import { TypeController } from "../controllers/type-controller";

export const typeRouter = Router();
const typeController = new TypeController();

typeRouter.get("", typeController.getAll);
typeRouter.get("/:type", typeController.getOne);
