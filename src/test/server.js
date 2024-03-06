import { setupServer } from "msw/node";
import { rest } from "msw";

export const createServer = (handlerConfig) => {
  // take array of config objects and transform them into set of handlers
  const handlers = handlerConfig.map((config) => {
    return rest[config.method || "get"](config.path, (req, res, ctx) => {
      return res(ctx.json(config.res(req, res, ctx)));
    });
  });

  // setup a mock server
  const server = setupServer(...handlers);

  // start server one time before all tests run
  beforeAll(() => {
    server.listen();
  });

  // reset handlers between each test
  afterEach(() => {
    server.resetHandlers();
  });

  // close server one time before all tests run
  afterAll(() => {
    server.close();
  });
};
