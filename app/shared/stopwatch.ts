export class Stopwatch {
    private _timerId: number = null;

    constructor(
        private _period: number,
        private _onTimerEnd: () => void
    ) {}

    start() {
        if (this._timerId !== null) {
            return;
        }
        this._timerId = setTimeout(() => {
            this._onTimerEnd();
        }, this._period);
    }

    stop() {
        clearInterval(this._timerId);
        this._timerId = null;
    }

    restart() {
        this.stop();
        this.start();
    }
}
