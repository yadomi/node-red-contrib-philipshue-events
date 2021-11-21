import { NodeInitializer, NodeConstructor, NodeDef, Node } from "node-red";
const EventEmitter = require("events");
const EventSource = require('eventsource');

const nodeInit: NodeInitializer = (RED): void => {
  const node: NodeConstructor<Node, NodeDef, Record<string, never>> = function (
    config
  ) {
    this.emitter = new EventEmitter();
    this.config = config;

    const endpoint = 'https://' + config.address + "/eventstream/clip/v2";

    try {
      const es = new EventSource(endpoint, {
        headers: {
          "hue-application-key": this.config.applicationkey,
        }, 
        https: { rejectUnauthorized: false },
      }); 

      es.onmessage = message => {
        const events = JSON.parse(message.data);
        this.emitter.emit('event', events)
      }
  
      es.onerror = error => {
        this.emitter.emit('error', error)
      }
    } catch (e) {
      console.error(e)
    }

    RED.nodes.createNode(this, config);
  };

  RED.nodes.registerType("philipshue-events-config", node);
};

export = nodeInit;
