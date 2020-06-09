const emojiUnicodeEnum = {
    HEART: '1F493',
    SLIGHTLY_SMILING_FACE: '1F642',
    LOUDLY_CRYING_FACE: '1F62D',
    FACE_WITH_TEARS_OF_JOY: '1F602',
    WEARY_FACE: '1F629'
}

const emojiAsciiEnum = {
    HEART: '<3',
    SLIGHTLY_SMILING_FACE: ':)',
    LOUDLY_CRYING_FACE: 'D;',
    FACE_WITH_TEARS_OF_JOY: ':lol:',
    WEARY_FACE: ':weary:'
}

function insert_string(index, str, to_be_inserted) {
    let msg = str.substr(0, index) + str.substr(index+2, str.length);
    console.log(msg);

    let newMessage = msg.substring(0, index) + to_be_inserted + msg.substring(index, str.length);
    return newMessage;
}

class Emojifier {
    constructor() { }

    replace = function(message) {

        const emojiCode = ['1F493', '1F642',]
        const utfCode = '&#x'
        let newMessage = message;
        let emoji;

        for (let i = 0; i < newMessage.length; i++) {
            if (newMessage[i] == '<' && newMessage[i + 1] == '3') {
                newMessage = insert_string(i , newMessage, utfCode + emojiUnicodeEnum.HEART);
            } else if (newMessage[i] == ':' && newMessage[i + 1] == ')') {
                newMessage = insert_string(i , newMessage, utfCode + emojiUnicodeEnum.SLIGHTLY_SMILING_FACE);
            } else if (newMessage[i] == 'D' && newMessage[i + 1] == ';') {
                newMessage = insert_string(i , newMessage, utfCode + emojiUnicodeEnum.LOUDLY_CRYING_FACE);
            }
        }

        return newMessage;
    }
}

