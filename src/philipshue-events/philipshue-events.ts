import { NodeInitializer, NodeConstructor } from "node-red";

const nodeInit: NodeInitializer = (RED): void => {
  const node: NodeConstructor = function (config) {
    const status = {
      incoming: () => {
        this.status({ fill: "blue", text: "Incoming..." });
        setTimeout(status.listening, 1000);
      },
      connected: () => {
        this.status({ fill: "green", text: "Connected" });
        setTimeout(status.listening, 1000);
      },
      disconected: () => {
        this.status({ fill: "red", text: "Not connected" });
      },
      listening: () => {
        this.status({ fill: "green", text: "Listening" });
      },
      error: () => {
        this.status({ fill: "red", text: "Error" });
      },
    };

    RED.nodes.createNode(this, config);
    status.disconected();

    this.bridge = RED.nodes.getNode(config.bridge);
    if (!this.bridge) return;

    status.listening();

    this.bridge.emitter.on("event", (events) => {
      status.incoming();

      for (const event of events) {
        this.send({ payload: event });
      }
    });

    this.bridge.emitter.on("error", (error) => {
      status.error();
      this.send({ payload: error });
    });

    this.bridge.emitter.on("onopen", status.connected)
  };

  RED.nodes.registerType("philipshue-events", node);
};

export = nodeInit;
