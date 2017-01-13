import { Injectable } from '@angular/core';
import { Data } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Data';
import { Query } from '../../node_modules/everlive-sdk/dist/declarations/everlive/query/Query';

import { EverliveProvider } from './everlive-provider.service';
import { EventRegistrationsService } from './event-registrations.service';
import { UsersService } from './users.service';
import { Event } from '../shared/models';
import { utilities } from '../shared';

@Injectable()
export class EventsService {
    private _data: Data<Event>;
    private readonly _eventExpandExpression: any = {
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

    create(event: Event) {
        return this._data.create(event);
    }

    getAll() {
        return this._getWithFilter({});
    }

    getById(eventId: string) {
        return this._data.expand(this._eventExpandExpression)
            .getById(eventId)
            .then(r => r.result);
    }

    getUpcoming() {
        let filter = this._getUpcomingFilter();
        return this._getWithFilter(filter);
    }

    getUpcomingCountsByGroups(groupIds: string[]): Promise<{ GroupId: string, Name: number }[]> {
        let groupFilter = { GroupId: { $in: groupIds} };
        let filter = this._getUpcomingFilter(groupFilter);

        let query = this._elProvider.getNewAggregateQuery();
        query.where(filter);
        query.groupBy('GroupId').count('Name');
        return this._data.aggregate(query)
            .then((r: any) => r.result);
    }

    getPast(userGroupIds: string[]) {
        if (!userGroupIds.length) {
            return Promise.reject({ message: 'No group ids specified' });
        }
        
        let filter = {
            EventDate: { $lt: new Date().toISOString() },
            GroupId: { $in: userGroupIds }
        };
        return this._usersService.currentUser()
            .then(u => this._getWithFilter(filter, true, { field: 'EventDate', desc: true }));
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

    validateEvent(event: Event): string {
        let errorMsg: string;

        for (let fieldName of utilities.eventMandatoryFields) {
            if (!utilities.isNonemptyString(event[fieldName])) {
                errorMsg = `The field ${fieldName} is invalid`;
                break;
            }
        }

        if (!event.EventDate && (!event.EventDateChoices || event.EventDateChoices.length === 0)) {
            errorMsg = 'Must specify at least one event date option.';
        }
        
        return errorMsg;
    }

    update(event: Event) {
        this._clearExpandedFields(event);
        return this._data.updateSingle(event);
    }

    deleteById(eventId: string) {
        return this._data.destroySingle(eventId);
    }

    private _getUpcomingFilter(groupFilter?) {
        let registrationFilter = [ { OpenForRegistration: true }, { RegistrationCompleted: true } ];
        let dateFilter = [
                { EventDate: { $gte: new Date().toISOString() } },
                { EventDate: { $exists: false } },
                { EventDate: null }
            ];
            
        let filter = {
            $and: [
                { $or: registrationFilter },
                { $or: dateFilter }
            ]
        };
        if (groupFilter) {
            filter.$and.push(groupFilter);
        }
        
        return filter;
    }

    private _clearExpandedFields(event: any) {
        delete event.Group;
        delete event.Organizer;
        delete event.ImageUrl;
    }

    private _getWithFilter(filter: any, expand: any = true, sorting?: { field: string, desc?: boolean }|Array<{ field: string, desc?: boolean }>) {
        let query = this._elProvider.getNewQuery();
        query.where(filter);
        
        sorting = sorting || [{ field: 'EventDate' }];
        sorting = [].concat(sorting);
        sorting.forEach(sortType => {
            let sortFunc = sortType.desc ? query.orderDesc : query.order;
            sortFunc.call(query, sortType.field);
        });

        if (expand === true) {
            query.expand(this._eventExpandExpression);
        } else {
            query.expand(expand);
        }

        return this._data.get(query).then(r => r.result);
    }
}
