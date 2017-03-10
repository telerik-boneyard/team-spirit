import { Injectable, EventEmitter } from '@angular/core';
import { EverliveProvider } from './';
import { Stopwatch, constants } from '../shared';

@Injectable()
export class LoadingIndicatorService {
    extendedLoading: EventEmitter<void>;
    allLoaded: EventEmitter<void>;
    private _interval = null;
    private _ongoingRequestsCount: number = 0;
    private _stopwatch: Stopwatch;
    private _loadingMode = false;

    constructor(
        private _elProvider: EverliveProvider
    ) {
        this.extendedLoading = new EventEmitter<void>();
        this.allLoaded = new EventEmitter<void>();
        this.threshold = constants.extendedLoadingThreshold;

        this._elProvider.get.on('beforeExec', (query) => {
            if (query && query.canceled !== true) {
                this._queueLoading();
            }
        });

        this._elProvider.get.on('beforeExecute', query => {
            if (query.contentTypeName === 'Files') {
                this._loadingMode = true;
                this.extendedLoading.emit();
            }
        });
        
        this._elProvider.get.on('afterExecute', () => this._dequeueLoading());
    }

    get threshold() {
        return this._interval;
    }
    
    set threshold(val: number) {
        this._interval = val;
        this._stopwatch = new Stopwatch(val, this._onIntervalHit.bind(this));
    }

    private _onIntervalHit() {
        if (this._ongoingRequestsCount > 0 && !this._loadingMode) {
            this._emitExtendedLoading();
        }
    }

    private _queueLoading() {
        this._ongoingRequestsCount++;
        this._stopwatch.restart();
    }

    private _dequeueLoading() {
        this._ongoingRequestsCount = Math.max(this._ongoingRequestsCount - 1, 0);
        if (this._ongoingRequestsCount === 0 && this._loadingMode) {
            this._stopwatch.stop();
            this._emitAllLoaded();
        }
    }

    private _emitExtendedLoading() {
        this.extendedLoading.emit();
        this._loadingMode = true;
    }

    private _emitAllLoaded() {
        this.allLoaded.emit();
        this._loadingMode = false;
    }
}
