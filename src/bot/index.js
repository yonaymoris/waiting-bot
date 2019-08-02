import messages from './messages';

const defaultConfig = {
    name: 'waiting-bot',
    delays: {
        greeting: 10000,
        good: 1000,
        bad: 20000
    },
    maxBadMessages: 5,

    callback: function (message) {
        console.log(message);
    }
};

/**
 * Get a random index in the provided array.
 * @param {*} array 
 */
function getRandomIndexInArray(array) {
    return (Math.floor(Math.random() * array.length));
}

class Bot {
    constructor(config = defaultConfig) {
        this.name = config.name;
        this._delays = config.delays;
        this._maxBadMessages = config.maxBadMessages;
        this._callback = config.callback;

        this._init();
    }

    /**
     * Reset the variables necessary to put the bot in a clean state.
     */
    _init() {
        clearInterval(this._timer);
        this._isActive = false;
        this._badMessagesCount = 0;
        this._prevMessage = '';
        this._timer = null;
    }

    /**
     * Set a timer for a random greeting message.
     */
    _queueGreetingMessage() {
        clearTimeout(this._timer);
        this._timer = setInterval(() => {
            const random = getRandomIndexInArray(messages.greeting);
            this._callback(messages.greeting[random]);
            this._queueBadMessage();
        }, this._delays.greeting);
    }

    /**
     * Set a timer for a random 'good' message.
     */
    _queueGoodMessage() {
        clearTimeout(this._timer);
        this._timer = setInterval(() => {
            const random = getRandomIndexInArray(messages.good);
            this._callback(messages.good[random]);
            this._queueBadMessage();
        }, this._delays.good);
    }

    /**
     * Set a timer for a random 'bad' message.
     */
    _queueBadMessage() {
        clearTimeout(this._timer);
        this._timer = setInterval(() => {
            this._badMessagesCount++;

            // Return a 'final' message once we've reached maximum amount of
            // 'bad' messages
            if (this._badMessagesCount === this._maxBadMessages) {
                const random = getRandomIndexInArray(messages.badFinal);
                this._callback(messages.badFinal[random]);
                this.stop();
                return;
            }

            // Prevent bot from using the same 'bad' message twice
            let random = getRandomIndexInArray(messages.bad);
            let msg = messages.bad[random];
            while (msg === this._prevMessage) {
                random = getRandomIndexInArray(messages.bad);
                msg = messages.bad[random];
            }

            this._prevMessage = msg;
            this._callback(msg);

        }, this._delays.bad);
    }

    /**
     * Start the bot. Will automatically set a timer for the greeting message.
     * Calling this function more than once will not do anything. To restart
     * the bot, use stop() first and then start().
     */
    start() {
        if (!this._isActive) {
            this._init();
            this._isActive = true;
            this._queueGreetingMessage();
        }
    }

    /**
     * Stop the bot from sending messages.
     */
    stop() {
        clearTimeout(this._timer);
        this._isActive = false;
    }

    /**
     * This function will queue a 'good' message unless the provided message
     * is falsy.
     * @param {*} message 
     */
    receive(message) {
        if (message) {
            this._badMessagesCount = 0;
            this._queueGoodMessage();
        }
    }
}

export default Bot;