const CheckWin = require('./Checker')

const io = require("socket.io")(3001, {
    cors: {
        origin: ['http://localhost:3000']
    }
})

var Clients=0;
io.on("connection", socket => {
    console.log(socket.id)
    if(Clients%2 === 0){
        socket.emit("Value",0);
    }else{
        socket.emit("Value",1)
    }
    Clients++;
    socket.on("send-update",(delta) => {
        console.log(delta);
        socket.emit("receive-change",delta,false)
        socket.broadcast.emit("receive-change",delta,true)
        if(CheckWin(delta) === true){
            socket.emit("finished",true)
            socket.broadcast.emit("finished",false)
        }
    })
})