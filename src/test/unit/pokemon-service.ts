import { request } from "http";
import { setup } from "../../app";

describe("Test the root path", async () => {
  test("It should response the GET method", async (done) => {
    request(await setup())
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
