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

const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
        methods: ["GET", "POST"],
    }
});

const roomInfo = {};

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            userName: roomInfo[socketId]
        }
    })
}


io.on('connection', (socket) => {
    socket.emit('firstJoin', {
        socketId: socket.id,
    })
    
    socket.on('join', ({roomId, userName}) => {
        roomInfo[socket.id] = userName;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({socketId}) => {
            io.to(socketId).emit('joined', {
                clients,
                userName,
                socketId: socket.id
            })
        })
    });

    socket.on('codeChange', async ({roomId, code}) => {
        await socket.to(roomId).emit('codeChangeBackend', {code});
    });

    socket.on('syncCode', ({code, socketId}) => {
        io.to(socketId).emit('codeChangeBackend', {code});
    });

    socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('callUser', {
            signal: data.signalData,
            from: data.from
        })
    })

    socket.on('ansToCall', (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    })

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];

        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                userName: roomInfo[socket.id]
            })
        });

        delete roomInfo[socket.id];

        socket.leave();
    });
});

server.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
})