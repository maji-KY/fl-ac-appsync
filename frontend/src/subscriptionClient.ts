import { Sink, SubscribePayload } from "graphql-ws/lib/common";
import { ExecutionResult } from "graphql";

export class SubscriptionClient {
  private ws: WebSocket;
  private ack: boolean = false;
  private subscribeQueue: { payload: SubscribePayload; sink: Sink }[] = [];
  private sinkMap: Map<string, Sink> = new Map();
  constructor(url: string, private token: string, private host: string) {
    const data = {
      "Authorization": token,
      host,
    };
    const header = Buffer.from(JSON.stringify(data), "ascii").toString("base64");
    this.ws = new WebSocket(`${url}?header=${header}&payload=e30=`, ["graphql-ws"]);
    this.ws.onopen = event => {
      console.log("onopen", event);
      this.ws.send(JSON.stringify({ "type": "connection_init" }));
    };
    this.ws.onerror = event => {
      console.error("onerror", event);
    };
    this.ws.onmessage = event => {
      console.log("onmessage", event);
      const data = JSON.parse(event.data);
      if (data.type === "data") {
        this.sinkMap.get(data.id)?.next(data.payload);
      } else if (data.type === "connection_ack") {
        this.ack = true;
        this.consumeSubscribeQueue();
      } else if (data.type === "error") {
        console.error(data);
        const sink = this.sinkMap.get(data.id);
        sink?.error(data.payload);
        sink?.complete();
      }
    };
    this.ws.onclose = event => {
      console.log("onclose", event);
    };
  }

  get isReady(): boolean {
    return this.ack;
  }

  private consumeSubscribeQueue() {
    console.log("consumeSubscribeQueue", this.subscribeQueue);
    while (this.subscribeQueue.length > 0) {
      const req = this.subscribeQueue.shift()!;
      const id = new Date().getTime().toString(10);
      this.sinkMap.set(id, req.sink);
      this.ws.send(
        JSON.stringify({
          id,
          type: "start",
          payload: {
            data: JSON.stringify({
              query: req.payload.query,
              operationName: req.payload.operationName,
              variables: req.payload.variables,
            }),
            extensions: {
              authorization: {
                Authorization: this.token,
                host: this.host,
              },
            },
          },
        }),
      );
    }
  }

  subscribe<Data = Record<string, unknown>, Extensions = unknown>(
    payload: SubscribePayload,
    sink: Sink<ExecutionResult<Data, Extensions>>,
  ) {
    if (this.isReady) {
      this.subscribeQueue.push({ payload, sink });
      this.consumeSubscribeQueue();
    } else {
      this.subscribeQueue.push({ payload, sink });
    }
  }
}
