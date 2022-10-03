import { DataSource } from "typeorm";
import { AbilityEntity } from "./entities/ability";
import { PokemonEntity } from "./entities/pokemon";
import { SpriteEntity } from "./entities/sprite";
import { TypeEntity } from "./entities/type";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "postgres",
  synchronize: false,
  logging: false,
  entities: [PokemonEntity, AbilityEntity, SpriteEntity, TypeEntity],
  subscribers: [],
  migrations: [],
});
