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


var Clients = new Map();
// Serve the static files from the React app

app.get('/verify/:id', (req,res) => {
    if(Clients.has(req.params.id) === true){
        res.status(200).json({status: true})
    }else{
        res.status(200).json({status: false})
    }
})


// Handles any requests that don't match the ones above
app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname+'/build/'));
});

app.get('/:id', (req,res) =>{
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
    if(regexExp.test(req.params.id) === true){
        res.sendFile(path.join(__dirname+'/build/'));
    }else{
        res.status(404).json({error: "Malformed ID"})
    }
});
//cors






io.on("connection", socket => {
    socket.on("connect-to-room", (roomId) => {
        const numberOfClients = Clients.get(roomId);
        if(numberOfClients === undefined){
            socket.join(roomId);
            Clients.set(roomId,1);
        }else if(numberOfClients === 1){
            socket.join(roomId);
            Clients.set(roomId,2);
            socket.broadcast.emit("Value",0,true);
            socket.emit("Value",1,false);
        }else{
            socket.emit("Value",-2,false);   
        }
        socket.on("send-update", (delta) => {
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
    console.log(`App listening on port ${port}`)
});