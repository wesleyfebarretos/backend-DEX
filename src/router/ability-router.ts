import { Router } from "express";
import { AbilityController } from "../controllers/ability-controller";

export const abilityRouter = Router();
const abilityController = new AbilityController();

abilityRouter.get("", abilityController.getAll);
abilityRouter.get("/:ability", abilityController.getOne);
