import { NodeInitializer, NodeConstructor } from "node-red";

const nodeInit: NodeInitializer = (RED): void => {
  const node: NodeConstructor = function (config) {
    RED.nodes.createNode(this, config);

    this.bridge = RED.nodes.getNode(config.bridge);
    this.bridge.emitter.on('event', events => {
      for (const event of events) {
        this.send({ payload: event });
      }
    })

    this.bridge.emitter.on('error', error => {
      this.send({ payload: error });
    })
  }

  RED.nodes.registerType("philipshue-events", node);
};

export = nodeInit;
