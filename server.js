const PORT = process.env.PORT || 8080;

const express = require('express');
const socket = require('socket.io');
const app = express();

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})

app.get('/getUsers', (req, res) => {
    res.send({ users: users });
})

let server = app.listen(PORT, () => {
    console.log('Server started! :)');
})

let io = socket(server);
let users = [];
let disconnectedUser;

function AnnounceUserEntrance(name) {

    let boldName = `<b class="introUser">${name}</b>`

    const intro =
        [
            `Look out it's ${boldName} coming through!`,
            `${boldName} came here to chat and chew bubblegum, he's all of out gum.`,
            `It's a bird! It's a plane! NO IT'S ${boldName}!`,
            `It's ${boldName}, first of her name, Queen of the Andals and the First Men, Breaker of Chains, Khaleesi of the Great Grass Sea.`,
            `Here's ${boldName}, the King of the North!`,
            `${boldName}: YOU SHALL NOT PASS!!`,
            `${boldName} brought his sword, bow and axe to this fellowship.`
        ]

    let randomNum = Math.floor(Math.random() * 7);

    const announce = `<div class="announcement">${intro[randomNum]}</div>`

    return announce;
}

function AnnounceUserExit(name) {
    let boldName = `<b class="exitUser">${name}</b>`

    const exit =
        [
            `if(!${boldName}){ std::cout << "GOODBYE!"}`,
            `All of ${boldName} Argon!`,
            `See you in a 0001, ${boldName}!`,
            `${boldName} byte the dust.`
        ]

    let randomNum = Math.floor(Math.random() * 4);


    const announce = `<div class="announcement">${exit[randomNum]}</div>`

    return announce;
}

io.on('connection', socket => {
    console.log('Host Id Connected: ', socket.id);
    let tempId = socket.id;

    socket.on('userIndex', userIndex => {
        console.log(userIndex)
    })

    // Emits message sent from user to clientside users 
    socket.on('message', user => {
        io.emit('message', user);
        console.log(user.name + '(' + user.id + ')' + ': ' + user.message);
    })

    socket.on('user list update', user => {
        users.push(user);
        io.emit('user list update', users);
    })

    socket.on('announce name', name => {

        let announce = AnnounceUserEntrance(name);

        io.emit('announce name', announce)
    })

    // Sends message to server user dced
    socket.on('disconnect', e => {

        for (let i = 0; i < users.length; i++) {
            if (users[i].id == tempId) {
                disconnectedUser = users[i].name;
                users.splice(i, 1);
            }
        }

        let announce = AnnounceUserExit(disconnectedUser);

        io.emit('disconnect', users, disconnectedUser, announce);

        console.log('Host Id Disconnected: ', tempId, "User: ", disconnectedUser);
    })
});