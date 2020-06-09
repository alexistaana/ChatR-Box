$(document).ready(function () {

    // global variables
    let socket;
    let colorPickr;
    let selectedPickerText;
    let selectedPickerMsg;
    let changeColorTextReceive;
    let changeColorTextSend;
    let changeColorMsgReceive;
    let changeColorMsgSend;
    let TextOrMsg;
    let emojiGrabber;

    // User object
    class User {
        constructor(name, id, message) {
            this.name = name;
            this.id = id;
            this.message = message;
        }
    }

    // Creates new user
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

            // Loads chatroom on browser
            LoadChatroom();

            // Grabs user connected id
            socket.on('connect', (e) => {
                user.id = socket.id;
                // Add connected user to the list of users online and announces
                AddUserToUserList();
                AnnounceUserEntrance();
            })

            let colorDef = [`#1AC8DB`, `#ff9e9e`, `white`, `white`]

            // Initializes Color Selectors and watches for selector click
            for (let i = 0; i < 4; i++) {
                CreateColorPicker(colorDef[i]);
            }

            WatchForColorSelector(); // Adds watcher to see if user selects color
            AddEmojiToInput(); // Adds watcher to see if user selects emoji to add
            EmitAndGrabMessage(); // Watches/Calls to grab message and send to server
            DeleteUserFromList(); // Calls function to watch for user disconnection
        });
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
                    <input type="text" name="message" placeholder="Enter message..." id="msgForm" required="">
                    </input>

                    <!-- Send Button -->
                    <button id="sendButton">
                    </button>
                </form>
                <div id="emojiSelector"> </div>

            </div>
        </div>
        `
        // Removes the user box 
        $('#outUserBox').remove();

        // Shows Chatroom
        $('body').prepend(chtroom);

        // Adds Emoji selector to the input area
        $('body').css('background-color', '#83c6ff6e');
        emojiGrabber = $('#emojiSelector').emojioneArea({
            standalone: true,
            search: false,
            shortcuts: false,
            autocomplete: false
        });
    }

    // When chatroom enters, adds user to the list
    function AddUserToUserList() {
        socket.emit('user list update', user);

        socket.on('user list update', e => {
            let userAdd;

            $('#userList').empty();

            for (let i = 0; i < e.length; i++) {
                userAdd = `<p id="${e[i].id}" class="userName">${e[i].name}</p>`
                $('#userList').append(userAdd);
            }
        })
    }

    // Announces user entrance
    function AnnounceUserEntrance() {
        socket.emit('announce name', user.name);

        socket.on('announce name', e => {
            $('#messageList').append(e);
            // scrolls to the bottom of the messenger
            const messageList = $('#messageList');
            messageListHeight = messageList[0].scrollHeight;
            $('#messageList').scrollTop(messageListHeight);
        })


    }

    // Deletes disconnected user from lsit
    function DeleteUserFromList() {

        socket.on('disconnect', (e, disconnectedUser, announce) => {
            let userAdd;

            // Updates List
            $('#userList').empty();
            for (let i = 0; i < e.length; i++) {
                userAdd = `<p id="${e[i].id}" class="userName">${e[i].name}</p>`
                $('#userList').append(userAdd);
            }

            AnnounceUserExit(announce);
        })
    }

    // Announces user exit
    function AnnounceUserExit(announce) {
        $('#messageList').append(announce);

        // scrolls to the bottom of the messenger
        const messageList = $('#messageList');
        messageListHeight = messageList[0].scrollHeight;
        $('#messageList').scrollTop(messageListHeight);
    }

    function AddEmojiToInput() {
        emojiGrabber[0].emojioneArea.on("emojibtn.click", function (btn, e) {
            let tempMsg = $('#msgForm').val();
            let tempEmoji = $('#emojiSelector').html();

            tempMsg = tempMsg + tempEmoji;
            $('#msgForm').val(tempMsg);
        });
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

            $(`.receiveMessage`).css('color', `${changeColorTextReceive}`);
            $(`.sendMessage`).css('color', `${changeColorTextSend}`);
            $(`.receive`).css('background-color', `${changeColorMsgReceive}`);
            $(`.send`).css('background-color', `${changeColorMsgSend}`);
        });
    }

    // Color Picker Section

    // Creates the Color pickers within the settings
    function CreateColorPicker(colorDef) {
        colorPickr = Pickr.create({
            el: '.colorpicker',
            theme: 'nano',
            default: `${colorDef}`,

            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 1)',
                'rgba(156, 39, 176, 1)',
                'rgba(103, 58, 183, 1)',
                'rgba(63, 81, 181, 1)',
                'rgba(33, 150, 243, 1)',
                'rgba(3, 169, 244, 1)',
                'rgba(0, 188, 212, 1)',
                'rgba(0, 150, 136, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(139, 195, 74, 1)',
                'rgba(205, 220, 57, 1)',
                'rgba(255, 235, 59, 1)',
                'rgba(255, 193, 7, 1)'
            ],

            components: {
                preview: true,
                opacity: true,
                hue: true,
            }
        });


        colorPickr.on('change', (color, instance) => {

            if (TextOrMsg == 'text') {
                if (selectedPickerText == 'receiveMessage') {
                    changeColorTextReceive = color.toRGBA().toString();
                    $(`#textColorReceive .pickr button`).css('color', changeColorMsgReceive);
                } else {
                    changeColorTextSend = color.toRGBA().toString();
                    $(`#textColorSend .pickr button`).css('color', changeColorTextSend);
                }

                let changeColor = color.toRGBA().toString();
                $(`.${selectedPickerText}`).css('color', changeColor);
            } else {
                if (selectedPickerMsg == 'receive') {
                    changeColorMsgReceive = color.toRGBA().toString();
                    $(`#bubbleColorReceive .pickr button`).css('color', changeColorMsgReceive);
                } else {
                    changeColorMsgSend = color.toRGBA().toString();
                    $(`#bubbleColorSend .pickr button`).css('color', changeColorMsgSend);
                }

                let changeColor = color.toRGBA().toString();
                $(`.${selectedPickerMsg}`).css('background-color', changeColor)
            }
        })
    }

    // Watches the different color selectors
    function WatchForColorSelector() {
        $('#bubbleColorReceive').on('click', e => {
            e.preventDefault();
            TextOrMsg = 'msg';
            selectedPickerMsg = 'receive';
        })
        $('#bubbleColorSend').on('click', e => {
            e.preventDefault();
            TextOrMsg = 'msg';
            selectedPickerMsg = 'send';
        })
        $('#textColorReceive').on('click', e => {
            e.preventDefault();
            TextOrMsg = 'text';
            selectedPickerText = 'receiveMessage';
        })
        $('#textColorSend').on('click', e => {
            e.preventDefault();
            TextOrMsg = 'text';
            selectedPickerText = 'sendMessage';
        })
    }

    // Run functions
    function Init() {
        WatchEnterUser();
    }

    Init();
})