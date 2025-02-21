const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
// static server
app.use(express.static(path.join(__dirname, '')));

let chatData = {
    defaultMessages: [
        { role: 'bot', content: 'can you need some help?' },
        { role: 'user', content: 'let me see...' }
    ],
    memoryMessages: [ 
        { role: 'bot', content: 'Memory message 1' },
        { role: 'bot', content: 'Memory message 2' }
    ],
    retrievalMessage:[
        { role: 'bot', content: 'retrieval message' },
    ], 
    accessMessage:[
        { role: 'bot', content: 'access message' },
    ],
    memoryRequests: {
        status: 'pending'
    }
};

// Get chat messages
function getChatMessages(includeMemory = false, chatId) {
    const {defaultMessages, memoryMessages, retrievalMessage ,accessMessage} = chatData;
    let messages = chatId === 0?[...defaultMessages,...retrievalMessage,...accessMessage]:[...defaultMessages];
    if(includeMemory){
         messages = [...messages, ...memoryMessages];
    }
    return {
        messages,
        memoryRequests: chatData.memoryRequests
    };
}

// approve memory access
function approveMemoryAccess() {
    chatData.memoryRequests.status = 'approved';
    return getChatMessages(true);
}

// reject memory access
function rejectMemoryAccess() {
    chatData.memoryRequests.status = 'rejected';
    return getChatMessages(false); 
}

// chatid-0 all message
app.get('/chat/:id', (req, res) => {
    const chatId = parseInt(req.params.id);
    if (chatId === 0) {
        const includeMemory = req.query.includeMemory === 'true'; 
        const data = getChatMessages(includeMemory,0);
        res.json(data);
    } else {
        res.status(404).json({ error: 'Chat not found' });
    }
});

// Approve 
app.post('/memory/approve-access', (req, res) => {
    const { accessCode } = req.body; //maybe do something by use accesscode
    const result = approveMemoryAccess();
    res.json(result);
});

// Reject
app.post('/memory/reject-access', (req, res) => {
    const result = rejectMemoryAccess();
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
