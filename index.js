const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 4000;

let clients = [];

io.on('connection', (socket) => {
  socket.on('client-id', ({ clientId }) => {
    const client = {
      clientId,
      socketId: socket.id,
    };
    console.log('A Client Connected!', client);
    clients = [...clients, client];
  });

  socket.on('disconnect', () => {
    clients = clients.filter((c) => {
      if (c.socketId === socket.id) {
        const client = {
          clientId: c.clientId,
          socketId: c.socketId,
        };
        console.log('A Client Disconnected!', client);
        return false;
      } else {
        return true;
      }
    });
  });

  socket.on('message', ({ name, message }) => {
    io.emit('message', { name, message });
  });
});

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
