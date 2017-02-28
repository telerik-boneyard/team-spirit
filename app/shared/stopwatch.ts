export class Stopwatch {
    private _timer: number = null;
    // private _startTime: number;

    constructor(
        private _period: number,
        private _onTimerEnd: () => void
    ) {}

    start() {
        this._timer = setTimeout(() => {
            this._onTimerEnd();
        }, this._period);
    }

    stop() {
        clearInterval(this._timer);
        this._timer = null;
    }

    restart() {
        this.stop();
        this.start();
    }

    // get elapsed() {
    //     let result: number = 0;
    //     if (typeof this._startTime === 'number') {
    //         result = Date.now() - this._startTime;
    //     }
    //     return result;
    // }

    // start() {
    //     this._startTime = Date.now();
    // }

    // stop() {
    //     this._startTime = null;
    // }

    // restart() {
    //     this.stop();
    //     this.start();
    // }
}
