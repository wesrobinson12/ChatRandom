const http = require('http');
const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');
const socket = require('socket.io');
const uuidv4 = require('uuid/v4');

const proxy = httpProxy.createProxyServer({});

const app = express();

app.use(require('morgan')('short'));

(function initWebpack() {
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config.js');

    const compiler = webpack(webpackConfig);

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true, publicPath: webpackConfig.output.publicPath,
    }));

    app.use(require('webpack-hot-middleware')(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
    }));

    app.use(express.static(path.join(__dirname, '/')));
}());

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () => {
    const address = server.address();
    console.log('Listening on: %j', address);
    console.log('http://localhost:%d', address.port);
});

const io = socket(server);

function findWaitingRoom(socket, pastRooms) {
  var rooms = Object.keys(io.sockets.adapter.rooms);

  for (var i = 0; i < rooms.length; i++) {
    var room = io.sockets.adapter.rooms[rooms[i]];
    if (room.length < 2 && !pastRooms.includes(rooms[i])) {
      return rooms[i];
    }
  }

  return null;
}

let rooms = {};

io.on('connection', (socket) => {
  // leave initial room created
  socket.leave(socket.id);

  // on connection, check for rooms with other users,
  // otherwise create your own
  socket.on('USER_CONNECTED', function(user) {
    let emptyRoom = findWaitingRoom(socket, []);
    if (emptyRoom === null) {
      let newRoomId = uuidv4();
      console.log('creating new room ' + newRoomId);
      rooms[newRoomId] = [user.user];
      socket.join(newRoomId);
      io.emit('ROOM_JOINED', { name: newRoomId, new: true, users: rooms[newRoomId] });
    } else {
      console.log('joining other user in room ' + emptyRoom);
      rooms[emptyRoom].push(user.user);
      socket.join(emptyRoom);
      io.emit('ROOM_JOINED', { name: emptyRoom, new: false, users: rooms[emptyRoom] });
    }
    console.log(rooms);
  });

  socket.on('SEND_MESSAGE', function(data) {
    console.log('sending message to room', data.room);
    io.to(data.room).emit('RECEIVE_MESSAGE', data);
  });

  socket.on('JOIN_NEW_ROOM', function(roomData) {
    socket.leave(roomData.currentRoom);

    io.emit('USER_LEFT', { room: roomData.currentRoom });
    let newRoom = findWaitingRoom(socket, roomData.pastRooms);
    if (newRoom === null) {
      let newRoomId = uuidv4();
      console.log('creating new room ' + newRoomId);
      rooms[newRoomId] = [roomData.user];
      socket.join(newRoomId);
      io.emit('ROOM_JOINED', { name: newRoomId, new: true, users: rooms[newRoomId] });
    } else {
      console.log('joining other user in room ' + newRoom);
      rooms[newRoom].push(roomData.user);
      socket.join(newRoom);
      io.emit('ROOM_JOINED', { name: newRoom, new: false, users: rooms[newRoom] });
    }
  });


});
