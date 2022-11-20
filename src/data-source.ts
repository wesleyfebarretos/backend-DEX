import "reflect-metadata";
import { DataSource } from "typeorm";
import { AbilityEntity } from "./entities/ability-entity";
import { PokemonEntity } from "./entities/pokemon-entity";
import { SpriteEntity } from "./entities/sprite-entity";
import { TypeEntity } from "./entities/type-entity";

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
    migrations: ["./src/migratios/*.ts"]
});
