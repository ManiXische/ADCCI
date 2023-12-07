export default class Queue {
    constructor(autorun = true, queue = []) {
        this.running = false;
        this.autorun = autorun;
        this.queue = queue;
        this.previousValue = undefined;
    }

    add(cb) {
        this.queue.push(() => {
            const finished = new Promise((resolve, reject) => {
                const callbackResponse = cb();
                if (callbackResponse !== false) {
                    resolve(callbackResponse);
                } else {
                    reject(callbackResponse);
                }
            });

            finished.then(this.dequeue.bind(this), (() => {}));
        });

        if (this.autorun && !this.running) {
            this.dequeue();
        }

        return this;
    }

    dequeue() {
        this.running = this.queue.shift();

        if (this.running) {
            this.running();
        }

        return this.running;
    }

    get next() {
        return this.dequeue;
    }
}