$(document).ready(function () {

    let socket;
    class User {
        constructor(name, id, message) {
            this.name = name;
            this.id = id;
            this.message = message;
        }
    }
    let user = new User();
    let userIndex;

    // watches if user enters a name
    function WatchEnterUser() {
        $('#formInputName').submit(e => {
            e.preventDefault();

            // Connects to server
            socket = io();

            const name = $(e.currentTarget).find('#inputName');
            user.name = name.val();
            name.val('');

            // Loads chatroom on browser
            LoadChatroom();

            // Grabs user connected id
            socket.on('connect', (e) => {
                user.id = socket.id;
                // Add connected user to the list of users online
                AddUserToUserList();
            })

            // Watches/Calls to grab message and send to server
            EmitAndGrabMessage();

            // Moshi
            DeleteUserFromList();
        });
    }

    function AddUserToUserList() {
        socket.emit('user list update', user);

        socket.on('user list update', e => {
            let userAdd;

            $('#userList').empty();

            for (let i = 0; i < e.length; i++) {
                userAdd = `<p id="${e[i].id}" class="userName">${e[i].name}</p>`
                $('#userList').append(userAdd);

                if (user.id == e.id) {
                    userIndex = i;
                }
            }
        })
    }

    function DeleteUserFromList() {
        socket.on('disconnect', e => {
            let userAdd;

            $('#userList').empty();

            for (let i = 0; i < e.length; i++) {
                userAdd = `<p id="${e[i].id}" class="userName">${e[i].name}</p>`
                $('#userList').append(userAdd);

                if (user.id == e.id) {
                    userIndex = i;
                }
            }
        })
    }

    // Function to load chatroom
    function LoadChatroom() {
        const chtroom =
            `
        <!-- CHAT BOX -->
        <div id="chatroom">
    
            <!-- User List -->
            <div id="userBox">
                <h1 id="userListHeader">Users</h1>
                <div id="userList">
                </div>
            </div>
    
            <!-- ChatArea -->
            <div id="inputLogs">
    
                <div id="messageList">
                </div>
    
                <!-- Input Area -->
                <form action="#" id="inputForm">
                    <input type="text" name="message" placeholder="Enter message..." id="msgForm">
                    </input>
    
                    <!-- Send Button -->
                    <button id="sendButton">
                        <i class="fas fa-arrow-alt-circle-up" id="arrowImg"></i>
                    </button>
                </form>
    
            </div>
        </div>
        `
        // Removes the user box 
        $('#outUserBox').remove();

        // Shows Chatroom
        $('body').prepend(chtroom);
    }

    // Emits Messages to the server
    function EmitAndGrabMessage() {

        $('#inputForm').submit(e => {
            e.preventDefault();
            const msg = $(e.currentTarget).find('#msgForm');
            user.message = msg.val();
            socket.emit('message', user);
            msg.val('');
            return false;
        });

        socket.on('message', (e) => {
            let addChatBubble;

            console.log(e);


            if (e.id != user.id) {
                addChatBubble =
                    `
                <div class="chatBubble receive">
                    <p class="chatMsg">${e.message}</p>
                </div>
                <label for="chatBubble" class="chatLabelReceive"">${e.name}</label>
                `
            }
            else {
                addChatBubble =
                    `
                <div class="chatBubble send">
                    <p class="chatMsg">${e.message}</p>
                </div>
                <label for="chatBubble" class="chatLabelSend">${e.name}</label>
                `
            }

            const messageList = $('#messageList');
            messageListHeight = messageList[0].scrollHeight;

            $('#messageList').append(addChatBubble);
            $('#messageList').scrollTop(messageListHeight);
        });
    }

    // Run functions
    function Init() {
        WatchEnterUser();
    }

    Init();
})