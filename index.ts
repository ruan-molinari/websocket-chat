const server = Bun.serve({
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return // do not return a response
    }

    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    async message(ws, msg) {
      console.log("Message was received from server", msg);
      let message;
      try {
        message = JSON.parse(msg.toString());
      } catch (e) {
        console.log('wrong format');
        return;
      }

      if (message.type === 'BROADCAST') {
        let newMessage = {
          type: 'BROADCAST',
          payload: {
            author: 'Server',
            message: message!.payload.messagea,
          },
        };
        ws.publish('chat', JSON.stringify(newMessage));
      }
      if (message.type === 'SENDTOSERVER') {
        let response = {
          type: 'SERVER_MESSAGE',
          payload: {
            author: 'Server',
            message: 'I received your message:<<' + message.payload.message + '>>',
          },
        };
        ws.publish('chat', JSON.stringify(response));
      }
    },
    open(ws) {
      ws.subscribe('chat');
      console.log("Connection opened", ws);
    },
    close(_ws, _code, _message) {
      console.log("Connection closed");
    },
    drain(_ws) {}
  }
});

console.log(`Serving at ${server.hostname}:${server.port} ...`);
