import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import request, { SuperTest, Test } from "supertest";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { setup } from "../../app";
import { AppDataSource } from "../../data-source";
import { TypeEntity } from "../../entities/type-entity";
import { typeRepository } from "../../repositories/types-repository";

describe("Type Controller", () => {
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
      await createType("water");
      await createType("fire");

      const response = await server.get("/type");
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.length).toBe(2);
    });

    it("findOneById", async () => {
      const type = await createType("dark");

      const response = await server.get(`/type/${type.id}`);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.name).toBe(type.name);
      expect(response.body.id).toBe(type.id);
    });

    it("findOneByName", async () => {
      const type = await createType("fire");

      const response = await server.get(`/type/${type.name}`);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.name).toBe(type.name);
      expect(response.body.id).toBe(type.id);
    });

    it("findOneError", async () => {
      const response = await server.get("/type/light");
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });

  async function createType(name: string): Promise<TypeEntity> {
    return await typeRepository.save({
      name: name,
    });
  }
});
