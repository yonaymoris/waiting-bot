import React, { useState, useReducer, useRef, useEffect, useLayoutEffect } from 'react';
import Bot from 'bot';

// CONFIGURE OPTIONS HERE
const userName = 'You';
const botConfig = {
    name: 'matsu',
    delays: {
        greeting: 5000,
        good: 1000,
        bad: 10000
    },
    maxBadMessages: 5
};

function messagesReducer(state, action) {
    if (action.content) {
        const newMsg = {
            timestamp: Date.now(),
            author: action.author,
            content: action.content
        };
        return state.concat([newMsg]);
    }

    return state;
}

function App() {
    // Callback that gets executed whenever bot has a message to send
    function onBotMessage(message) {
        addMessage({
            author: chatBot.name,
            content: message
        });
    }

    const chatBot = useState(new Bot({
        ...botConfig,
        callback: onBotMessage
    }))[0];
    const chatLog = useRef(null);
    const [messages, addMessage] = useReducer(messagesReducer, []);
    const [text, setText] = useState('');

    function onSubmit(e) {
        e.preventDefault();
        addMessage({
            author: userName,
            content: text
        });
        chatBot.receive(text);
        setText('');
    }

    // Start the bot on component mount and stop on unmount
    useEffect(() => {
        chatBot.start();
        return () => chatBot.stop();
    }, [chatBot]);

    // Scroll to bottom whenever a new message is added
    useLayoutEffect(() => {
        chatLog.current.scrollTop = chatLog.current.scrollHeight;
    }, [messages]);

    return (
        <div className='container'>
            <main className='content'>
                <div className='chat'>

                    <div className='log' ref={chatLog}>
                        <p className='start-message'>
                            This is the start of your conversation with {botConfig.name}.
                        </p>

                        {messages.map((msg, i) => <div key={i}
                            className={'message' + ((msg.author === userName) ? ' current-user' : '')}
                        >
                            <span>{msg.author}: {msg.content}</span>
                        </div>)}
                    </div>

                    <form className='input' onSubmit={onSubmit}>
                        <input
                            placeholder={`Say something to ${botConfig.name}...`}
                            type='text'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            autoFocus
                        />
                    </form>

                </div>
            </main>
        </div>
    );
}

export default App;