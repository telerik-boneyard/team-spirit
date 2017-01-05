import { Injectable } from '@angular/core';
import Everlive from 'everlive-sdk';
import { Item } from '../../node_modules/everlive-sdk/dist/declarations/everlive/interfaces/Item';


import { constants } from '../shared';

@Injectable()
export class EverliveProvider {
    private _everlive: Everlive;

    constructor() {
        this._everlive = new Everlive({
            appId: constants.appId,
            authentication: {
                persist: true
            }
        });
    }

    get get(): Everlive {
        return this._everlive;
    }

    getData<T extends Item>(collectionName: string) {
        return this._everlive.data<T>(collectionName);
    }

    getNewQuery() {
        return new Everlive.Query();
    }
}
