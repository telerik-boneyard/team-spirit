import { Injectable } from '@angular/core';
import { Data } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Data';
import { Query } from '../../node_modules/everlive-sdk/dist/declarations/everlive/query/Query';

import { EverliveProvider } from './everlive-provider.service';
import { EventRegistrationsService } from './event-registrations.service';
import { UsersService } from './users.service';
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
            ReturnAs: 'Organizer',
            Expand: {
                Image: {
                    ReturnAs: 'ImageUrl',
                    SingleField: 'Uri'
                }
            }
        },
        Image: {
            ReturnAs: 'ImageUrl',
            SingleField: 'Uri'
        }
    };
    
    constructor(
        private _elProvider: EverliveProvider,
        private _registrationsService: EventRegistrationsService,
        private _usersService: UsersService
    ) {
        this._data = this._elProvider.get.data<Event>('Events');
    }

    getAll() {
        return this._getWithFilter(this._elProvider.getNewQuery());
    }

    getById(eventId: string) {
        return this._data.expand(this._eventExpandExpression)
            .getById(eventId)
            .then(r => r.result);
    }

    getUpcoming() {
        let filter = {
            $or: [
                { EventDate: { $gte: new Date().toISOString() } },
                { EventDate: { $exists: false } }
            ]
        };
        return this._getWithFilter(filter);
    }

    getPast() {
        let filter = {
            $or: [
                { EventDate: { $lt: new Date().toISOString() } }
            ]
        };
        return this._getWithFilter(filter);
    }

    getParticipants(eventId: string) {
        return this._registrationsService.getParticipants(eventId);
    }

    registerForEvent(eventId: string, dateChoices: number[]) {
        return this._usersService.currentUser()
            .then(u => {
                return this._registrationsService.create(eventId, u.Id, dateChoices);
            });
    }

    isPastEvent(event: Event): boolean {
        return event.EventDate && new Date(event.EventDate) < new Date();
    }

    private _getWithFilter(filter: any, expand = true) {
        let query = this._elProvider.getNewQuery();
        query.where(filter);

        if (expand) {
            query.expand(this._eventExpandExpression);
        }

        return this._data.get(query).then(r => r.result);
    }
}
