// Creating a new WebSocket instance
const socket = new WebSocket('ws://localhost:3000');

// Connection
socket.addEventListener('open', (event) => {
  let sayhi = {
    type: "SENDTOSERVER",
    payload: {
      message: "Hello server, How are you?"
    },
  };
  socket.send(JSON.stringify(sayhi));
  document.getElementById("logging").innerText += "\n" + "You sent the this message to the server: " + sayhi.payload.message;
  document.getElementById("sendmessagebutton")?.addEventListener("click", () => {
    let newMessage = {
      type: "BROADCAST",
      payload: {
        author: "A USER",
        message: "Hi Everyone",
      },
    };
    socket.send(JSON.stringify(newMessage));
    document.getElementById("logging").innerText += "\n" + "Message broadcasted to the server: " + newMessage.payload.message;
  });
  document.getElementById("sendtoserver").addEventListener("click", () => {
    let newMessage = {
      type: "SENDTOSERVER",
      payload: {
        author: "A USER",
        message: "This message is for the server only",
      },
    };
    socket.send(JSON.stringify(newMessage));
  });
})

socket.addEventListener('message', (event) => {
  try {
    let message = JSON.parse(event.data)
    if (message.type == 'BROADCAST') {
      document.getElementById('logging').innerText += "\n" + "A client broadcast: " + message.payload.message;
    } else {
      document.getElementById('logging').innerText += "\n" + "Message received: " + message.payload.message;
    }
  } catch (e) {
    console.log('Wrong format', e);
    return
  }
})

socket.addEventListener('close', (event) => {
  console.log('Server connection closed:', event.reason);
})
