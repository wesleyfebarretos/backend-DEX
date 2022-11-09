import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import request, { SuperTest, Test } from "supertest";
import { setup } from "../../app";
import { AppDataSource } from "../../data-source";
import { AbilityEntity } from "../../entities/ability-entity";
import { PokemonEntity } from "../../entities/pokemon-entity";
import { TypeEntity } from "../../entities/type-entity";
import { PaginateObject } from "../../services/pokemon-service";
import {
  TestContainer,
  StartedTestContainer,
  StoppedTestContainer,
  GenericContainer,
  Wait,
} from "testcontainers";
import { abilityRepository } from "../../repositories/abilities-repository";

describe("Pokemon Controller", () => {
  let app: Express;
  let server: SuperTest<Test>;

  beforeAll(async () => {
    //docker run --name some-postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres
    const container: TestContainer = new GenericContainer("postgres")
      .withEnvironment({
        POSTGRES_PASSWORD: "password",
      })
      .withExposedPorts({
        container: 5432,
        host: 5432,
      })
      .withWaitStrategy(
        Wait.forLogMessage("database system is ready to accept connections")
      );
    const startedContainer: StartedTestContainer = await container.start();
    await AppDataSource.runMigrations();

    app = await setup();
    server = request(app);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe("GET", () => {
    it("findAll", async () => {
      const response = await server.get("/pokemon");

      expect(response.statusCode).toBe(StatusCodes.OK);
      const pokemonList: PaginateObject<PokemonEntity> = response.body;

      expect(pokemonList.next).toBe(
        `http://localhost:3000/pokemon?offset=24&limit=24`
      );

      expect(pokemonList.results.length).toBeGreaterThan(0);
    });

    it("findOne", async () => {
      const response = await server.get("/pokemon/1");
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe("bulbasaur");
      expect(response.body.types).toEqual([
        { id: 1, name: "grass" },
        { id: 2, name: "poison" },
      ]);
    });

    it("findOne", async () => {
      const response = await server.get("/pokemon/charizard");
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.id).toBe(6);
      expect(response.body.name).toBe("charizard");
      expect(response.body.types).toEqual([
        { id: 3, name: "fire" },
        { id: 4, name: "flying" },
      ]);
    });

    it("findOne", async () => {
      const response = await server.get("/pokemon/veno");
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it("findTypes", async () => {
      const response = await server.get("/type");
      expect(response.statusCode).toBe(StatusCodes.OK);
      const typesList: TypeEntity[] = response.body;
      expect(typesList.length).toBeGreaterThan(17);
    });

    it("findOneType", async () => {
      const response = await server.get("/type/1");
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.pokemons.length).toBeGreaterThan(128);
      expect(response.body.id).toEqual(1);
      expect(response.body.name).toEqual("grass");
    });

    it("findOneType", async () => {
      const response = await server.get("/type/dark");
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.pokemons.length).toBeGreaterThan(1);
      expect(response.body.id).toEqual(18);
      expect(response.body.name).toEqual("dark");
    });

    it("findOneType", async () => {
      const response = await server.get("/type/light");
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it("findAbilities", async () => {
      const response = await server.get("/ability");
      expect(response.statusCode).toBe(StatusCodes.OK);
      const abilitiesList: AbilityEntity[] = response.body;
      expect(abilitiesList.length).toEqual(267);
    });

    it("findOneAbility", async () => {
      const response = await server.get("/ability/1");
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.name).toEqual("overgrow");
      expect(response.body.id).toEqual(1);
    });

    it("findOneAbility", async () => {
      const response = await server.get("/ability/rain-dish");
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.name).toEqual("rain-dish");
      expect(response.body.id).toEqual(6);
    });

    it("findOneAbility", async () => {
      const response = await server.get("/ability/kamehameha");
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it("updatePokemonName", async () => {
      const response = await server
        .put("/pokemon/1177/name")
        .send({ name: "davifodao" });
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("updatePokemonAbilities", async () => {
      const response = await server
        .put("/pokemon/1177/abilities")
        .send({ abilities: [1, 2] });
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("updatePokemonTypes", async () => {
      const response = await server
        .put("/pokemon/1177/types")
        .send({ types: [1, 18] });
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("updatePokemonSprites", async () => {
      const response = await server.put("/pokemon/davifodao/sprites").send({
        sprites: [
          {
            img: "goodzerto2",
            name: "back_default",
          },
          {
            img: "evilzerto2",
            name: "back_shiny",
          },
          {
            img: "goodDavi2",
            name: "front_default",
          },
          {
            img: "evilDavi2",
            name: "front_shiny",
          },
        ],
      });
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("deletePokemon", async () => {
      const response = await server.delete("/pokemon/davifodao");
      expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
    });
  });

  describe("POST", () => {
    jest.setTimeout(1000 * 60 * 5);
    it("createPokemon", async () => {
      await abilityRepository.save({
        name: "overgrow",
        isHidden: false,
      });

      const response = await server.get("/ability/overgrow");
      expect(response.statusCode).toBe(StatusCodes.OK);
    });
  });
});
