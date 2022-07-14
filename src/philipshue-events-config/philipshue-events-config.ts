import { NodeInitializer, NodeConstructor, NodeDef, Node } from "node-red";
import EventEmitter from "events";
import EventSource from "eventsource";

const debug = !!process.env.DEBUG;
const NODE_NAME = "philipshue-events-config";

const nodeInit: NodeInitializer = (RED): void => {
  const node: NodeConstructor<Node, NodeDef, Record<string, never>> = function (config) {
    RED.nodes.createNode(this, config);

    let es: EventSource | null = null;
    this.emitter = new EventEmitter();
    this.config = config;

    if (!config.address || !config.applicationkey) return;

    const endpoint = "https://" + config.address + "/eventstream/clip/v2";
    const SSEConfig = {
      headers: {
        "hue-application-key": this.config.applicationkey,
      },
      https: { rejectUnauthorized: false },
    };

    const setup = () => {
      if (es === null || es.readyState === EventSource.CLOSED) {
        es = new EventSource(endpoint, SSEConfig);

        es.onmessage = (message) => {
          debug && console.log(NODE_NAME, "sse/onmessage", message);

          try {
            const events = JSON.parse(message.data);
            this.emitter.emit("event", events);

            debug && console.log(message);
          } catch (e) {
            console.error(e);
            this.emitter.emit("error", e);
          }
        };

        es.onerror = (error) => {
          debug && console.log(NODE_NAME, "sse/onerror", error);

          this.emitter.emit("error", error);
          console.error(error);

          if (es) {
            es.close();
          }

          setup();
        };

        es.onopen = () => {
          debug && console.log(NODE_NAME, "sse/onopen");

          this.emitter.emit("onopen");
        };
      }
    };

    this.on("close", () => {
      debug && console.log(NODE_NAME, "red/close");

      if (es) es.close();
    });

    setup();
  };

  RED.nodes.registerType(NODE_NAME, node);
};

export = nodeInit;
