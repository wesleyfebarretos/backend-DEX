import { Request, Response } from "express";
import { TypeService } from "../services/type-service";

export class TypeController {
  async getAll(_: Request, res: Response) {
    const result = await new TypeService().getAll();

    res.json(result);
  }

  async getOne(req: Request, res: Response) {
    const { type } = req.params;

    const result = await new TypeService().getOne(type);

    res.json(result);
  }
}
