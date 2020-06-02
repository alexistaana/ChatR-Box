$(document).ready(function () {

    let socket = io();
    class User {
        constructor(name, id) {
            this.name = name;
            this.id = id;
        }
    }
    let user = new User();

    function WatchEnterUser() {
        $('#formInputName').submit(e => {
            e.preventDefault();
            user.name = $('#inputName').val();
            $('#inputName').val('');

            socket.on('connect', (e) => {
                user.id = socket.id;
            })

            // Loads chatroom on browser
            LoadChatroom();
            // Watches/Calls to grab message and send to server
            EmitAndGrabMessage();
        });
    }

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


    function EmitAndGrabMessage() {

        let tempMsg;

        $('#inputForm').submit(e => {
            e.preventDefault();
            const msg = $(e.currentTarget).find('#msgForm');
            tempMsg = msg.val();
            socket.emit('sent message', tempMsg);
            msg.val('');
            return false;
        });

        socket.on('sent message', (e) => {
            let addChatBubble;
            if (e != tempMsg) {
                addChatBubble = 
                `
                <div class="chatBubble receive">
                    <p class="chatMsg">` + e + `</p>
                </div>
                <label for="chatBubble" class="chatLabelReceive"">${}</label>
                `
            }
            else {
                addChatBubble = 
                `
                <div class="chatBubble send">
                    <p class="chatMsg">` + e + `</p>
                </div>
                <label for="chatBubble" class="chatLabelSend"">${}</label>
                `
            }

            $('#inputLogs').append(addChatBubble);
            window.scrollTo(0, document.body.scrollHeight);
        });
    }

    function Init() {
        WatchEnterUser();
    }

    Init();
})