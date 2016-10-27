import { Injectable } from '@angular/core';
import { Data } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Data';
import { Query } from '../../node_modules/everlive-sdk/dist/declarations/everlive/query/Query';

import { EverliveProvider } from './everlive-provider.service';
import { Event } from '../shared/models';

@Injectable()
export class EventsService {
    private _data: Data<Event>;
    private _eventExpandExpression: any = {
        GroupId: {
            TargetTypeName: 'Groups',
            SingleField: 'Name',
            ReturnAs: 'Group'
        },
        OrganizerId: {
            TargetTypeName: 'Users',
            ReturnAs: 'Organizer'
        },
        Image: {
            'ReturnAs': 'ImageUrl',
            'SingleField': 'Uri'
        }
    };
    
    constructor(private _elProvider: EverliveProvider) {
        this._data = this._elProvider.get.data('Events');
    }

    getAll() {
        return this._getWithFilter(this._elProvider.getNewQuery());
    }

    getById(eventId: string) {
        return this._data.expand(this._eventExpandExpression).getById(eventId).then(r => r.result);
    }

    getUpcoming() {
        let query = this._elProvider.getNewQuery();
        query.where({
            $or: [
                { EventDate: { $gte: new Date().toISOString() } },
                { EventDate: { $exists: false } }
            ]
        });
        return this._getWithFilter(query);
    }

    private _getWithFilter(query: Query, expand = true) {
        if (expand) {
            query.expand(this._eventExpandExpression);
        }

        return this._data.get(query).then(r => r.result);
    }
}