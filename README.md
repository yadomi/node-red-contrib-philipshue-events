# node-red-contrib-philipshue-events

This package implements the Philips Hue API V2 EventSource as a node-red node.

See https://developers.meethue.com/develop/hue-api-v2/core-concepts/#events for more information about the Hue API V2 and the /eventstream endpoint

### Disclaimer

Please note that the Philips Hue API V2 is still in early access. Please make sure your bridge firmware is at least version **1948086000**. If you have any issue, you can try generating a new token. If you still encounted issues, feel free to open an issue in this repository.

## Node

There is only one flow node in this package: `philipshue-events`.

This node needs to have `philipshue-events-config` configured for your bridge. You can set the `address` and `hue-application-key` manually or use the auto-discovery/link-button.

The node will connect to the **EventSource** endpoint and output every events as a message.

The node will output event as JSON. Here is an example of `msg.payload`:

```json
{
  "creationtime": "2021-10-18T17:04:55Z",
  "data": [
    {
      "id": "e706416a-8c92-46ef-8589-3453f3235b13",
      "on": { "on": true },
      "owner": {
        "rid": "3f4ac4e9-d67a-4dbd-8a16-5ea7e373f281",
        "rtype": "device"
      },
      "type": "light"
    }
  ],
  "id": "9de116fc-5fd2-4b74-8414-0f30cb2cbe04",
  "type": "update"
}
```

You can then use built-in node-RED **switch** node to route the event based on `msg.payload.type` or `msg.payload.data[0].type`.

For more examples, see the [examples folder](https://github.com/yadomi/node-red-contrib-philipshue-events/tree/master/examples). You can also access them in Node-RED > Import > Examples > @yadomi/node-red-contrib-philipshue-events`.

For complexes use case, see **@andesse**'s [HUE-CLIP-API.Node-RED-Flows](https://github.com/andesse/HUE-CLIP-API.Node-RED-Flows) 

## Development

Clone the repository 

```
git clone git@github.com:yadomi/node-red-contrib-philipshue-events.git
cd node-red-contrib-philipshue-events
```

Install the dependencies:

```
yarn install
```

In a terminal, build and watch the nodes:

```
yarn build:watch
```

In a second terminal, run the debug node-red instance, accesssible via http://127.0.0.1:1880

```
yarn node-red
```