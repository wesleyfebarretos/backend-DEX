import { Express } from "express";
import request, { SuperTest, Test } from "supertest";
import { setup } from "../../app";
import { AppDataSource } from "../../data-source";
import { AbilityEntity } from "../../entities/ability-entity";
import { PokemonEntity } from "../../entities/pokemon-entity";
import { TypeEntity } from "../../entities/type-entity";
import { PaginateObject } from "../../services/pokemon-service";

describe("Pokemon Controller", () => {
  let app: Express;
  let server: SuperTest<Test>;

  beforeAll(async () => {
    app = await setup();
    server = request(app);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe("GET", () => {
    it("findAll", async () => {
      const response = await server.get("/pokemons");

      expect(response.statusCode).toBe(200);
      const pokemonList: PaginateObject<PokemonEntity> = response.body;

      expect(pokemonList.next).toBe(
        `http://localhost:3000/pokemons?offset=24&limit=24`
      );

      expect(pokemonList.results.length).toBeGreaterThan(0);
    });

    it("findOne", async () => {
      const response = await server.get("/pokemon/1");
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe("bulbasaur");
      expect(response.body.types).toEqual([
        { id: 1, name: "grass" },
        { id: 2, name: "poison" },
      ]);
    });

    it("findOne", async () => {
      const response = await server.get("/pokemon/charizard");
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(6);
      expect(response.body.name).toBe("charizard");
      expect(response.body.types).toEqual([
        { id: 3, name: "fire" },
        { id: 4, name: "flying" },
      ]);
    });

    it("findOne", async () => {
      const response = await server.get("/pokemon/veno");
      expect(response.statusCode).toBe(404);
    });

    it("findTypes", async () => {
      const response = await server.get("/types");
      expect(response.statusCode).toBe(200);
      const typesList: TypeEntity[] = response.body;
      expect(typesList.length).toBeGreaterThan(17);
    });

    it("findOneType", async () => {
      const response = await server.get("/types/1");
      expect(response.statusCode).toBe(200);
      expect(response.body.pokemons.length).toBeGreaterThan(128);
      expect(response.body.id).toEqual(1);
      expect(response.body.name).toEqual("grass");
    });

    it("findOneType", async () => {
      const response = await server.get("/types/dark");
      expect(response.statusCode).toBe(200);
      expect(response.body.pokemons.length).toBeGreaterThan(1);
      expect(response.body.id).toEqual(18);
      expect(response.body.name).toEqual("dark");
    });

    it("findOneType", async () => {
      const response = await server.get("/types/light");
      expect(response.statusCode).toBe(404);
    });

    it("findAbilities", async () => {
      const response = await server.get("/abilities");
      expect(response.statusCode).toBe(200);
      const abilitiesList: AbilityEntity[] = response.body;
      expect(abilitiesList.length).toEqual(267);
    });

    it("findOneAbility", async () => {
      const response = await server.get("/abilities/1");
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toEqual("overgrow");
      expect(response.body.id).toEqual(1);
    });

    it("findOneAbility", async () => {
      const response = await server.get("/abilities/rain-dish");
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toEqual("rain-dish");
      expect(response.body.id).toEqual(6);
    });

    it("findOneAbility", async () => {
      const response = await server.get("/abilities/kamehameha");
      expect(response.statusCode).toBe(404);
    });

    it("createNewPokemon", async () => {
      const response = await server.get("/pokemon/tester");
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(1157);
      expect(response.body.name).toEqual("tester");
    });

    it("createNewPokemon", async () => {
      const response = await server.get("/pokemon/1157");
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(1157);
      expect(response.body.name).toEqual("tester");
    });

    it("deletePokemon", async () => {
      const response = await server.get("/pokemon/1157");
      expect(response.statusCode).toBe(404);
    });

    it("updatePokemonName", async () => {
      const response = await server.get("/pokemon/1175");
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe("test30");
    });

    it("updatePokemonAbilities", async () => {
      const response = await server.get("/pokemon/1175");
      expect(response.statusCode).toBe(200);
      expect(response.body.abilities).toEqual([
        {
          id: 1,
          name: "overgrow",
          isHidden: false,
        },
        {
          id: 2,
          name: "chlorophyll",
          isHidden: true,
        },
      ]);
    });

    it("updatePokemonTypes", async () => {
      const response = await server.get("/pokemon/1175");
      expect(response.statusCode).toBe(200);
      expect(response.body.types).toEqual([
        {
          id: 1,
          name: "grass",
        },
        {
          id: 2,
          name: "poison",
        },
      ]);
    });

    it("updatePokemonSprites", async () => {
      const response = await server.get("/pokemon/1175");
      expect(response.statusCode).toBe(200);
      expect(response.body.sprites).toEqual([
        {
          id: 4699,
          img: "5",
          name: "back_default",
        },
        {
          id: 4700,
          img: "6",
          name: "back_shiny",
        },
        {
          id: 4701,
          img: "7",
          name: "front_default",
        },
        {
          id: 4702,
          img: "8",
          name: "front_shiny",
        },
      ]);
    });
  });
});
