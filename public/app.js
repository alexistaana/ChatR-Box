$(document).ready(function () {

    let socket;
    class User {
        constructor(name, id) {
            this.name = name;
            this.id = id;
        }
    }
    let user = new User();

    // watches if user enters a name
    function WatchEnterUser() {
        $('#formInputName').submit(e => {
            e.preventDefault();
            
            // Connects to server
            socket = io();

            const name = $(e.currentTarget).find('#inputName');
            user.name = name.val();
            name.val('');

            // Grabs user connected id
            socket.on('connect', (e) => {
                user.id = socket.id;
            })

            // Loads chatroom on browser
            LoadChatroom();
            // Watches/Calls to grab message and send to server
            EmitAndGrabMessage();
        });
    }

    // Function to load chatroom
    function LoadChatroom() {
        const chtroom = 
        `<div id="chatroom">
        <!-- CHAT BOX -->
            <div id="chatBox">
                <!-- Message Area -->
                <div id="inputLogs">
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
        
            <!-- User List -->
            <div id="userList">
                <!-- <div class="users">Billy</div>
                <div class="users">Billy</div>
                <div class="users">Billy</div> -->
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

        let tempMsg;

        $('#inputForm').submit(e => {
            e.preventDefault();
            const msg = $(e.currentTarget).find('#msgForm');
            tempMsg = msg.val();
            socket.emit('message', tempMsg);
            msg.val('');
            return false;
        });

        socket.on('message', (e) => {
            let addChatBubble;
            if (e != tempMsg) {
                addChatBubble = '<div class="chatBubble receive"><p class="chatMsg">' + e + '</p></div>'
            }
            else {
                addChatBubble = '<div class="chatBubble send"><p class="chatMsg">' + e + '</p></div>'
            }

            $('#inputLogs').append(addChatBubble);
            window.scrollTo(0, document.body.scrollHeight);
        });
    }

    // Run functions
    function Init() {
        WatchEnterUser();
    }

    Init();
})