import { Injectable } from '@angular/core';
import { EverliveProvider } from './everlive-provider.service';
import { Data } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Data';
import { Item } from '../../node_modules/everlive-sdk/dist/declarations/everlive/interfaces/Item';

@Injectable()
export class EventsService {
    private _data: Data<Item>;
    
    constructor(private _elProvider: EverliveProvider) {
        this._data = this._elProvider.get.data('Events');
    }
}