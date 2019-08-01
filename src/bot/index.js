import messages from './messages';

class Bot {
    constructor(name) {
        this.name = name;
        this.timer = null;
        this.useBadMessage = false;
        this.prevMessage = '';
    }

    /**
     * Start a timer that executes the specified callback. The previous timer is
     * cleared whenever you call this function.
     * @param {*} callback - The function to execute when the timer completes.
     * @param {number} delay - 
     */
    startTimer(callback, delay = 6000) {
        clearTimeout(this.timer);

        const id = setInterval(callback, delay);
        this.timer = id;
    }

    /**
     * Get a random message. If the useBadMessage instance variable is true, this
     * function will return a 'bad' message. Otherwise, it will return a 'good'
     * message.
     */
    getMessage() {
        const validMessages = this.useBadMessage ? messages.bad : messages.good;
        let random = (Math.floor(Math.random() * validMessages.length));

        // Prevent bot from using same message twice
        while (validMessages[random] === this.prevMessage) {
            random = (Math.floor(Math.random() * validMessages.length));
        }

        const msg = validMessages[random];
        this.prevMessage = msg;
        return msg;
    }
}

export default Bot;