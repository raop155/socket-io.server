const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 4000;

let clients = [];

io.on('connection', (socket) => {
  socket.on('clients', () => {
    io.emit('clients', clients);
  });

  socket.on('client-id', ({ branchId, deviceId }) => {
    const client = {
      branchId,
      deviceId,
      socketId: socket.id,
    };
    console.log('A Client Connected!', client);
    clients = [...clients, client];

    io.emit('clients', clients);
  });

  socket.on('meeting-status', ({ status }) => {
    const client = clients.find((x) => x.socketId === socketId);
    if (client) {
      client.meetingStatus = status;
      io.emit('clients', clients);
    }
  });

  socket.on('livemode', ({ status }) => {
    const client = clients.find((x) => x.socketId === socketId);
    if (client) {
      client.liveMode = status;
      io.emit('clients', clients);
    }
  });

  socket.on('disconnect', () => {
    clients = clients.filter((c) => {
      if (c.socketId === socket.id) {
        console.log('A Client Disconnected!');
        return false;
      } else {
        return true;
      }
    });

    io.emit('clients', clients);
  });
});

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
