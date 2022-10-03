import { Request, Response } from "express";
import axios from "axios";
import { AppDataSource } from "../data-source";

export class AllPokemonsController {
  async get(req: Request, res: Response) {
    // const offset = req.query.offset || "0";
    // const limit = req.query.limit || "24";
    // const result = await axios.get(
    //   `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    // );
    // const jsonAsString = JSON.stringify(result.data);
    // const jsonReplaced = jsonAsString.replaceAll(
    //   "https://pokeapi.co/api/v2/",
    //   "http://localhost:3000/"
    // );
    // const obj = JSON.parse(jsonReplaced);
    // res.send(obj);
  }
}
