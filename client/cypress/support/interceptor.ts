// source: https://www.npmjs.com/package/cypress-msw-interceptor
import { match } from 'node-match-path';

import worker from "../../test/mocks/browser";
import { http, HttpResponseResolver } from 'msw';

const { last } = Cypress._;

export type Call = {
  id: string,
  request: Request,
  response?: Response,
  complete: boolean
};

let requests: Record<string, { calls: Call[], complete: boolean }> = {};
let keys = new Set<string>();
let requestMap: Record<string, string> = {}; // { requestId: key }
let aliases: Record<string, string> = {}; // { alias: key }

const findRequestKey = (request: Request) => {
  return Array.from(keys).find(key => {
    const [method, url] = key.split(/:(.+)/);
    const routeMatched = match(url, request.url);

    return request.method === method && routeMatched.matches;
  });
};

const createRequestKey = (request: Request) => `${request.method}:${request.url}`;

const registerRequest = ({ request, requestId }: { request: Request, requestId: string }) => {
  const key = findRequestKey(request) || createRequestKey(request);
  if (!requests[key]) {
    requests[key] = { complete: false, calls: [] };
  }

  requests[key].complete = false;
  requests[key].calls.push({ id: requestId, request, complete: false });
  requestMap[requestId] = key;
};

const completeRequest = ({ response, requestId }: { response: Response, requestId: string }) => {
  const key = requestMap[requestId];
  if (!requests[key]) return;

  requests[key].complete = true;

  const call = requests[key].calls.find(i => i.id === requestId);
  if (!call) return;

  call.response = response;
  call.complete = true;

  Cypress.log({
    alias: aliases[key],
    displayName: `[MSW] completed`,
    message: `${requests[key]}`,
    consoleProps: () => ({
      [key]: requests[key],
      url: call.request.url,
      request: call.request,
      response,
    }),
  })
};

before(() => {
  worker.events.on('request:start', registerRequest)
  worker.events.on('response:mocked', completeRequest)
  worker.events.on('response:bypass', completeRequest)

  cy.wrap(
    worker.start({
      serviceWorker: { url: "./mockServiceWorker.js" },
      //onUnhandledRequest: 'bypass',
    }),
    //{ log: false }
  );
})

Cypress.on('test:before:run', () => {
  if (!worker) return

  worker.resetHandlers();
  requests = {};
  requestMap = {};
  keys = new Set();
  aliases = {};
});

Cypress.Commands.add('waitForRequest', (alias: string) => {
  cy.get<string>(alias, { log: false }).then(url => {
    Cypress.log({
      alias,
      displayName: 'Wait',
      name: 'wait',
      message: '',
    });

    cy.waitUntil(() => requests[url] && requests[url].complete, {
      log: false,
    }).then(() => {
      cy.wrap(last(requests[url].calls), { log: false });
    })
  });
});

const getCalls = (requests: Record<string, { calls: Call[], complete: boolean }>, alias: string) => {
  cy.get<string>(alias, { log: false }).then(name => {
    return cy.wrap(requests[name].calls, { log: false });
  });
};

Cypress.Commands.add('getRequestCalls', (alias: string) => getCalls(requests, alias));

Cypress.Commands.add('interceptRequest', (
  method: string, 
  path: string, 
  ...args: Array<string | HttpResponseResolver>
) => {
  const { alias, fn } = getInterceptArgs(...args);

  const route = Cypress.env("CYPRESS_BACKEND_URL") + path;
  const key = `${method.toUpperCase()}:${route}`;
  keys.add(key);

  if (fn) {
    worker.use(http[method.toLowerCase()](route, fn));
  }

  return setAlias(alias, key);
});

const getInterceptArgs = (...args: Array<string | HttpResponseResolver>) => {
  let alias: string | undefined;
  let fn: HttpResponseResolver | undefined;
  
  args.forEach(arg => {
    if (Cypress._.isFunction(arg)) {
      fn = arg;
    } else if (Cypress._.isString(arg)) {
      alias = arg;
    }
  });

  return { alias, fn };
};

const setAlias = (alias: string | undefined, value: string) => {
  if (alias) {
    aliases[value] = alias;

    return cy
      .wrap(value, { log: false })
      .as(alias)
      .then(() => value);
  }

  return value;
};
