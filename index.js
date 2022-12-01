const CheckWin = require('./Checker')

const io = require("socket.io")(3001, {
    cors: {
        origin: ['http://localhost:3000']
    }
})

// var Clients = 0;
var Clients = new Map();

io.on("connection", socket => {
    socket.on("connect-to-room", (roomId) => {
        const numberOfClients = Clients.get(roomId);
        console.log(roomId);
        if(numberOfClients === undefined){
            console.log("Inside Client 1")
            socket.join(roomId);
            Clients.set(roomId,1);
        }else if(numberOfClients === 1){
            socket.join(roomId);
            Clients.set(roomId,2);
            socket.broadcast.emit("Value",0,true);
            socket.emit("Value",1,false);
        }
        socket.on("send-update", (delta) => {
            console.log(delta);
            socket.emit("receive-change", delta, false)
            socket.broadcast.to(roomId).emit("receive-change", delta, true)
            if (CheckWin(delta) === true) {
                socket.emit("finished", true)
                socket.broadcast.to(roomId).emit("finished", false)
            }
        })
        socket.on('disconnect', function(){
            socket.broadcast.to(roomId).emit('leave');
            Clients.delete(roomId);
        });
    })
})