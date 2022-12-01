const CheckWin = require('./Checker')

const cors = require('cors')
const express = require('express')
const path = require('path');
const CheckDraw = require('./CheckDraw');
const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, '/build')));
var http = require('http').createServer(app);

const io = require("socket.io")(http, {
    cors: {
        origin: ['*','*:*']
    }
});


// Serve the static files from the React app




// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/build/'));
});

//cors





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
            }else if(CheckDraw(delta) === true){
                socket.emit("finished", -1)
                socket.broadcast.to(roomId).emit("finished",-1)
            }
        })
        socket.on('disconnect', function(){
            socket.broadcast.to(roomId).emit('leave');
            Clients.delete(roomId);
        });
    })
})

// const PORT = process.env.PORT || 9200
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })

http.listen(process.env.PORT || 3001, function() {
    var host = http.address().address
    var port = http.address().port 
    console.log('App listening at http://%s:%s', host, port)
});