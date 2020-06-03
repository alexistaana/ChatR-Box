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
let disconnectedUser;

io.on('connection', socket => {
    console.log('Host Id Connected: ', socket.id);
    let tempId = socket.id;

    socket.on('userIndex', userIndex => {
        console.log(userIndex)
    })

    // Emits message sent from user to clientside users 
    socket.on('message', user => {
        io.emit('message', user);
        console.log(user.name + '('+ user.id + ')' + ': ' + user.message);
    })

    socket.on('user list update' , user => {
        users.push(user);
        io.emit('user list update', users);
    })

    socket.on('announce name', announce => {
        io.emit('announce name', announce)
    })


    // Sends message to server user dced
    socket.on('disconnect', e => {
        
        for(let i = 0; i < users.length; i++){
            if(users[i].id == tempId){
                disconnectedUser = users[i].name;
                users.splice(i, 1);
            }
        }

        io.emit('disconnect', users, disconnectedUser);
        
        console.log('Host Id Disconnected: ', tempId, "User: ", disconnectedUser);
    })
});