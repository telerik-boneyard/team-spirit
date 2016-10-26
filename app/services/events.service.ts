import { Injectable } from '@angular/core';
import { Data } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Data';

import { EverliveProvider } from './everlive-provider.service';
import { Event } from '../shared/models';

@Injectable()
export class EventsService {
    private _data: Data<Event>;
    
    constructor(private _elProvider: EverliveProvider) {
        this._data = this._elProvider.get.data('Events');
    }

    getAll() {
        let expand = {
            GroupId: {
                TargetTypeName: 'Groups',
                SingleField: 'Name',
                ReturnAs: 'Group'
            },
            OrganizerId: {
                TargetTypeName: 'Users',
                ReturnAs: 'Organizer'
            }
        };
        let query = this._elProvider.getNewQuery();
        query.expand(expand);
        return this._data.get(query).then(r => r.result);
    }
}