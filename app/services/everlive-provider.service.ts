import Everlive from 'everlive-sdk'
import { Injectable } from '@angular/core'
import { constants } from '../shared'

@Injectable()
export class EverliveProvider {
    private _everlive: Everlive;

    constructor() {
        this._everlive = new Everlive(constants.appId);
    }

    get get(): Everlive {
        return this._everlive;
    }
}
