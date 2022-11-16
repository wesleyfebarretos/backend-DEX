import { Request, Response } from "express";
import { TypeService } from "./type-service";

export class TypeController {
  private typeService: TypeService;

  constructor(typeService: TypeService) {
    this.typeService = typeService;
  }

  async getAll(_: Request, res: Response) {
    const result = await this.typeService.getAll();

    res.json(result);
  }

  async getOne(req: Request, res: Response) {
    const { type } = req.params;

    const result = await this.typeService.getOne(type);

    res.json(result);
  }
}
