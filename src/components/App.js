import React, { useState, useReducer, useRef, useLayoutEffect } from 'react';
import Bot from 'bot';

const userName = 'You';
const botName = 'matsu';
const botMessageDelay = 6000;

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
    const [messages, addMessage] = useReducer(messagesReducer, []);
    const [text, setText] = useState('');
    const chatBot = useState(new Bot(botName))[0];
    const chatLog = useRef(null);

    function onSubmit(e) {
        e.preventDefault();
        addMessage({
            author: userName,
            content: text
        });
        setText('');

        // Reset bot's message timer
        chatBot.useBadMessage = false;
        chatBot.startTimer(() => {
            const msg = chatBot.getMessage();
            addMessage({
                author: chatBot.name,
                content: msg
            });
            chatBot.useBadMessage = true; // Ensure subsequent messages are 'bad'
        }, botMessageDelay);
    }

    function onChange(e) {
        setText(e.target.value);
    }

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
                            This is the start of your conversation with {botName}.
                        </p>

                        {messages.map((msg, i) => <div key={i}
                            className={'message' + ((msg.author === userName) ? ' current-user' : '')}
                        >
                            <span>{msg.author}: {msg.content}</span>
                        </div>)}
                    </div>

                    <form className='input' onSubmit={onSubmit}>
                        <input placeholder="Say something to matsu..." type="text" value={text} onChange={onChange} autofocus="true"/>
                    </form>

                </div>
            </main>
        </div>
    );
}

export default App;