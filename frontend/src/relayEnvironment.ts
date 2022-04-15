import { Environment, Network, RecordSource, Store, Observable } from "relay-runtime";
import { auth, NotAuthenticatedError } from "./auth";
import { SubscriptionClient } from "./subscriptionClient";

function fetchQuery(operation, variables) {
  const token = auth.token;
  if (token) {
    return fetch("https://7cglrrttvvchnc6fbns7aa6apa.appsync-api.ap-northeast-1.amazonaws.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": token,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    }).then(response => {
      return response.json();
    });
  } else {
    return Promise.reject(new NotAuthenticatedError());
  }
}

let _wsClient: SubscriptionClient;
function getWsClient(): SubscriptionClient {
  if (_wsClient) {
    return _wsClient;
  } else {
    console.log("create socket");
    const token = auth.token;
    if (token) {
      const client = new SubscriptionClient(
        "wss://7cglrrttvvchnc6fbns7aa6apa.appsync-realtime-api.ap-northeast-1.amazonaws.com/graphql",
        token,
        "7cglrrttvvchnc6fbns7aa6apa.appsync-api.ap-northeast-1.amazonaws.com",
      );
      _wsClient = client;
      return client;
    } else {
      throw new NotAuthenticatedError();
    }
  }
}

function subscribe(operation, variables): Observable<any> {
  return Observable.create(sink => {
    getWsClient().subscribe(
      {
        operationName: operation.name,
        query: operation.text,
        variables,
      },
      sink,
    );
  });
}

export const relayEnv = new Environment({
  network: Network.create(fetchQuery, subscribe),
  store: new Store(new RecordSource()),
});
