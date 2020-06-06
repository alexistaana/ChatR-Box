$(document).ready(function () {

    let socket;
    let colorPickr;
    let selectedPicker;
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
                AnnounceUserEntrance();
            })


            // Initializes Color Selectors and watches for selector click
            CreateBubbleReceiveColorPicker();
            CreateBubbleSendColorPicker();
            CreateTextReceiveSendColorPicker();
            CreateTextReceiveSendColorPicker();
            WatchForColorSelector();

            // Watches/Calls to grab message and send to server
            EmitAndGrabMessage();

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

                if (e.id == user.id) {
                    userIndex = i;
                }
            }
        })
    }

    function AnnounceUserEntrance() {
        const intro =
            [
                `Look out it's <b class="introUser">${user.name}</b> coming through!`,
                `<b class="introUser">${user.name}</b> came here to chat and chew bubblegum, he's all of out gum.`,
                `It's a bird! It's a plane! NO IT'S <b class="introUser">${user.name}</b>!`,
                `It's <b class="introUser">${user.name}</b>, first of her name, Queen of the Andals and the First Men, Breaker of Chains, Khaleesi of the Great Grass Sea.`,
                `Here's <b class="introUser">${user.name}</b>, the King of the North!`,
                `<b class="introUser">${user.name}</b>: YOU SHALL NOT PASS!!`,
                `<b class="introUser">${user.name}</b> brought his sword, bow and axe to this fellowship.`
            ]

        let randomNum = Math.floor(Math.random() * 7);

        const announce = `<div class="announcement">${intro[randomNum]}</div>`

        socket.emit('announce name', announce);

        socket.on('announce name', e => {
            $('#messageList').append(e);
        })
    }

    function AnnounceUserExit(e) {
        let randomNum = Math.floor(Math.random() * 4);

        const exit =
            [
                `if(!<b class="exitUser">${e}</b>){ cout << "GOODBYE!"}`,
                `All of <b class="exitUser">${e}</b> Argon!`,
                `See you in a 0001, <b class="exitUser">${e}</b>!`,
                `<b class="exitUser">${e}</b> byte the dust.`
            ]
        const announce = `<div class="announcement">${exit[randomNum]}</div>`

        $('#messageList').append(announce);
    }

    function DeleteUserFromList() {

        socket.on('disconnect', (e, disconnectedUser) => {
            let userAdd;

            // Updates List
            $('#userList').empty();
            for (let i = 0; i < e.length; i++) {
                userAdd = `<p id="${e[i].id}" class="userName">${e[i].name}</p>`
                $('#userList').append(userAdd);
            }

            AnnounceUserExit(disconnectedUser);
        })

    }

    // Function to load chatroom
    function LoadChatroom() {
        const chtroom =
        `
        <!-- CHAT BOX -->
        <div id="chatroom">

            <!-- List/Options -->
            <div id="miscBox">
                <h1 id="userListHeader">Users</h1>
                <div id="userList">
                </div>
                <!-- Bottom Corner/Page settings area -->
                <div id="settingsBox">
                    <!-- Bubble Message Settings -->
                    <h2 class="settingsHeader" >Bubble</h2>
                    <div class="colorSettingsBox">
                        <div id="bubbleColorReceive">
                            <div class="colorpicker">
                                
                            </div>
                        </div>
                        <div id="bubbleColorSend">
                            <div class="colorpicker">
                
                            </div>
                        </div>
                    </div>
                    
                    <!-- Text Message Settings -->
                    <h2 class="settingsHeader">Text</h2>
                    <div class="colorSettingsBox">
                        <div id="textColorReceive">
                            <div class="colorpicker">
                                
                            </div>
                        </div>
                        <div id="textColorSend">
                            <div class="colorpicker">
                                
                            </div>
                        </div>
                    </div>
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

            if (e.id != user.id) {
                addChatBubble =
                    `
                <div class="chatBubble receive">
                    <p class="chatMsg receiveMessage">${e.message}</p>
                </div>
                <label for="chatBubble" class="chatLabelReceive"">${e.name}</label>
                `
            }
            else {
                addChatBubble =
                    `
                <div class="chatBubble send">
                    <p class="chatMsg sendMessage">${e.message}</p>
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

    function CreateBubbleReceiveColorPicker(){
        colorPickr = Pickr.create({
            el: '.colorpicker',
            theme: 'nano',
            default: 'rgb(44, 40, 40);',
        
            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 0.95)',
                'rgba(156, 39, 176, 0.9)',
                'rgba(103, 58, 183, 0.85)',
                'rgba(63, 81, 181, 0.8)',
                'rgba(33, 150, 243, 0.75)',
                'rgba(3, 169, 244, 0.7)',
                'rgba(0, 188, 212, 0.7)',
                'rgba(0, 150, 136, 0.75)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(139, 195, 74, 0.85)',
                'rgba(205, 220, 57, 0.9)',
                'rgba(255, 235, 59, 0.95)',
                'rgba(255, 193, 7, 1)'
            ],
        
            components: {
        
                // Main components
                preview: true,
                opacity: true,
                hue: true,
        
                // Input / output Options
                interaction: {
                    input: true,
                    clear: true,
                    save: true
                }
            }
        });
    
        colorPickr.on('change', (color, instance) =>{
            let changeColor = color.toRGBA().toString();
            $(`.${selectedPicker}`).css('background-color', `${changeColor}`);
        })
    }

    function CreateBubbleSendColorPicker(){
        colorPickr = Pickr.create({
            el: '.colorpicker',
            theme: 'nano',
            default: '#04b571',
        
            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 0.95)',
                'rgba(156, 39, 176, 0.9)',
                'rgba(103, 58, 183, 0.85)',
                'rgba(63, 81, 181, 0.8)',
                'rgba(33, 150, 243, 0.75)',
                'rgba(3, 169, 244, 0.7)',
                'rgba(0, 188, 212, 0.7)',
                'rgba(0, 150, 136, 0.75)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(139, 195, 74, 0.85)',
                'rgba(205, 220, 57, 0.9)',
                'rgba(255, 235, 59, 0.95)',
                'rgba(255, 193, 7, 1)'
            ],
        
            components: {
        
                // Main components
                preview: true,
                opacity: true,
                hue: true,
        
                // Input / output Options
                interaction: {
                    input: true,
                    clear: true,
                    save: true
                }
            }
        });
    
        colorPickr.on('change', (color, instance) =>{
            let changeColor = color.toRGBA().toString();
            $(`.${selectedPicker}`).css('background-color', `${changeColor}`);
        })
    }

    function CreateTextReceiveSendColorPicker(){
        colorPickr = Pickr.create({
            el: '.colorpicker',
            theme: 'nano',
            default: 'white',
        
            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 0.95)',
                'rgba(156, 39, 176, 0.9)',
                'rgba(103, 58, 183, 0.85)',
                'rgba(63, 81, 181, 0.8)',
                'rgba(33, 150, 243, 0.75)',
                'rgba(3, 169, 244, 0.7)',
                'rgba(0, 188, 212, 0.7)',
                'rgba(0, 150, 136, 0.75)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(139, 195, 74, 0.85)',
                'rgba(205, 220, 57, 0.9)',
                'rgba(255, 235, 59, 0.95)',
                'rgba(255, 193, 7, 1)'
            ],
        
            components: {
        
                // Main components
                preview: true,
                opacity: true,
                hue: true,
        
                // Input / output Options
                interaction: {
                    input: true,
                    clear: true,
                    save: true
                }
            }
        });
    
        colorPickr.on('change', (color, instance) =>{
            let changeColor = color.toRGBA().toString();

            if(selectedPicker == 'receive' || selectedPicker == 'send'){
                $(`.${selectedPicker}`).css('background-color', `${changeColor}`);
            }
            else if(selectedPicker == 'receiveMessage' || selectedPicker == 'sendMessage'){
                $(`.${selectedPicker}`).css('color', `${changeColor}`);
            }
        })
    }

    function WatchForColorSelector(){
        $('#bubbleColorReceive').on('click', e => {
            e.preventDefault();
            selectedPicker = 'receive';
        })
        $('#bubbleColorSend').on('click', e => {
            e.preventDefault();
            selectedPicker = 'send';
        })
        $('#textColorReceive').on('click', e => {
            e.preventDefault();
            selectedPicker = 'receiveMessage';
        })
        $('#textColorSend').on('click', e => {
            e.preventDefault();
            selectedPicker = 'sendMessage';
        })
    }

    // Run functions
    function Init() {
        WatchEnterUser();
    }

    Init();
})