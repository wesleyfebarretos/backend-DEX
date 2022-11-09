import { Request, Response } from "express";
import { AbilityService } from "../services/ability-service";

export class AbilityController {
  async getAll(_: Request, res: Response) {
    const result = await new AbilityService().getAll();
    res.json(result);
  }

  async getOne(req: Request, res: Response) {
    const { ability } = req.params;

    const result = await new AbilityService().getOne(ability);
    res.json(result);
  }
}
