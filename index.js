const CheckWin = require('./Checker')

const io = require("socket.io")(3001, {
    cors: {
        origin: ['http://localhost:9200']
    }
})

const express = require('express')
const path = require('path');
const app = express()

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '/build')));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/build/'));
});

//cors
const cors = require('cors')

app.use(cors())

// var Clients = 0;
var Clients = new Map();

io.on("connection", socket => {
    socket.on("connect-to-room", (roomId) => {
        console.log(roomId);
        const numberOfClients = Clients.get(roomId);
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

const PORT = 9200
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})