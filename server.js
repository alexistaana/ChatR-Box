const PORT = process.env.PORT || 8080;

const express = require('express');
const socket = require('socket.io');

const app = express();

app.use(express.static('public'))

app.get('/', function(req, res){
    res.sendFile(`${__dirname}/public/index.html`)
})

let server = app.listen(PORT, function(){
    console.log('Server started!!');
})

let io = socket(server);
let users = [];

io.on('connection', function(socket){
    console.log('Host Id Connected: ', socket.id);
    let tempId = socket.id;

    // Sends message to server user dced
    socket.on('disconnect', (e) => {
        console.log('Host Id Disconnected: ', tempId);
    })

    // Emits message sent from user to clientside users 
    socket.on('message', (user) => {
        io.emit('message', user);
        console.log(user.name + '('+ user.id + ')' + ': ' + user.message);
    })

    socket.on('user list update' , (user) => {
        users.push(user);
        io.emit('user list update', users);
    })
});