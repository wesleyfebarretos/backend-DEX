import { Request, Response } from "express";
import { AbilityService } from "./ability-service";

export class AbilityController {
  private abilityService: AbilityService;

  constructor(abilityService: AbilityService) {
    this.abilityService = abilityService;
  }
  async getAll(_: Request, res: Response) {
    const result = await this.abilityService.getAll();
    res.json(result);
  }

  async getOne(req: Request, res: Response) {
    const { ability } = req.params;

    const result = await this.abilityService.getOne(ability);
    res.json(result);
  }
}
