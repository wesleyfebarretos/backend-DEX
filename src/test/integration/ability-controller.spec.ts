import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import request, { SuperTest, Test } from "supertest";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { setup } from "../../app";
import { AppDataSource } from "../../data-source";
import { AbilityEntity } from "../../entities/ability-entity";
import { abilityRepository } from "../../repositories/abilities-repository";

describe("Ability Controller", () => {
  let app: Express;
  let server: SuperTest<Test>;
  let container: StartedTestContainer;

  jest.setTimeout(1000 * 60);
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  beforeAll(async () => {
    //docker run --name some-postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres
    container = await new GenericContainer("postgres")
      .withEnvironment({
        POSTGRES_PASSWORD: "password",
      })
      .withExposedPorts({
        container: 5432,
        host: 5432,
      })
      .start();

    await sleep(1000);
    app = await setup();
    server = request(app);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    await AppDataSource.synchronize();
  });

  afterEach(async () => {
    await AppDataSource.dropDatabase();
  });

  describe("GET", () => {
    it("findAll", async () => {
      await createAbility("overgrow");
      await createAbility("regenerate");
      await createAbility("waterfall");

      const response = await server.get("/ability");
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.length).toBe(3);
    });

    it("findOneById", async () => {
      const ability = await createAbility("flash cannon");

      const response = await server.get(`/ability/${ability.id}`);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.name).toEqual(ability.name);
      expect(response.body.id).toEqual(ability.id);
    });

    it("findOneByName", async () => {
      const ability = await createAbility("solar beam");

      const response = await server.get(`/ability/${ability.name}`);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.isHidden).toEqual(ability.isHidden);
      expect(response.body.name).toEqual(ability.name);
      expect(response.body.id).toEqual(ability.id);
    });

    it("findOneError", async () => {
      const response = await server.get("/ability/kamehameha");
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });

  async function createAbility(name: string): Promise<AbilityEntity> {
    return await abilityRepository.save({
      name: name,
      isHidden: false,
    });
  }
});
