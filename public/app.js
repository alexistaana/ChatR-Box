$(document).ready(function () {

    function EmitMessage() {

        var socket = io();
        let tempMsg;

        $('form').submit(function () {
            socket.emit('sent message', $('#msgForm').val());
            tempMsg = $('#msgForm').val();
            $('#msgForm').val('');
            return false;
        });

        socket.on('sent message', function (e) {
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

    EmitMessage();
})