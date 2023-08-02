require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);

// creating instance of Server class(socket.io)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});

// List of (socketId - userName)
const roomInfo = {};

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            userName: roomInfo[socketId]
        }
    });
}

// Each unique client has their own socket
// Ex : client-1 ==> socket-1, client-2 ==> socket-2
io.on('connection', (socket) => {
    socket.emit('firstJoin', {
        socketId: socket.id,
    })
    
    // listening join event sent from client
    socket.on('join', ({roomId, userName}) => {
        roomInfo[socket.id] = userName;

        // current socket will be added to room(name will be roomId) if room exist otherwise it will create new room named as roomId as will add current socket to room
        socket.join(roomId);

        // Sending each Client to msg that new user with userName and socketId is joined to room(named roomId)
        const clients = getAllConnectedClients(roomId);
        /* clients list
        [
            { socketId: 'nQqxi47bE2UKV2zPAAAB', userName: 'Dhruv' },
            { socketId: 'zNJOZ25sPzHSeEVrAAAD', userName: 'Dhruv 2' }
        ]
        */

        // sending all users list + userName and socketId of new joined user
        clients.forEach(({socketId}) => {

            // to individual socketid including sender (private message)
            io.to(socketId).emit('joined', {
                clients,
                userName,
                socketId: socket.id
            })
        });
    });
    
    socket.on('codeChange', ({roomId, code}) => {
        socket.in(roomId).emit('codeChangeBackend', {code});
    });

    socket.on('syncCode', ({socketId, code}) => {
        io.to(socketId).emit('codeChangeBackend', {code});
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];

        rooms.forEach((roomId) => {
            // to all clients in roomId except the sender
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                userName: roomInfo[socket.id],
            })
        });

        delete roomInfo[socket.id];

        socket.leave();
    });
});

// listening server  // Note : here app.listen will not work
server.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
})