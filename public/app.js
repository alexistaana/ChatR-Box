$(document).ready(function () {

    let socket = io();

    function GetName(){
        socket.on('connect', (e) => {
            console.log(socket.id)
        })
    }   
    
    function EmitAndGrabMessage() {

        let tempMsg;
  
        $('form').submit( () => {
            socket.emit('sent message', $('#msgForm').val());
            tempMsg = $('#msgForm').val();
            $('#msgForm').val('');
            return false;
        });

        socket.on('sent message', (e) => {
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

    function Init(){
        GetName();
        EmitAndGrabMessage(); 
    }  

    Init();
})