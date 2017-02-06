import { Injectable } from '@angular/core';
import { Data } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Data';

import { EverliveProvider } from './everlive-provider.service';
import { EventRegistration, User } from '../shared/models';

@Injectable()
export class EventRegistrationsService {
    private _data: Data<EventRegistration>;
    private readonly _expandUserExpression = {
        UserId: {
            TargetTypeName: 'Users',
            ReturnAs: 'User',
            Expand: {
                Image: {
                    ReturnAs: 'ImageUrl',
                    SingleField: 'Uri'
                }
            }
        }
    };
    
    constructor(private _elProvider: EverliveProvider) {
        this._data = this._elProvider.get.data<EventRegistration>('EventRegistrations');
    }

    getAllForUser(userId: string, expandExpression?: any) {
        let query = this._elProvider.getNewQuery();
        query.where({ UserId: userId });
        if (expandExpression) {
            query.expand(expandExpression);
        }
        return this._data.get(query);
    }

    getParticipants(eventId: string) {
        let query: any = this._elProvider.getNewQuery();
        query.where().eq('EventId', eventId);
        query.expand(this._expandUserExpression);
        query.select('User');
        return this._data.get(query).then(resp => {
            let result: User[] = [];
            resp.result.forEach(r => r.User && result.push(r.User));
            return result;
        });
    }

    getEventDateChoiceCounts(eventId: string) {
        return this.getForEvent(eventId)
            .then((res) => {
                let result: any = {};
                res.forEach(reg => {
                    reg.Choices.forEach(choice => result[choice] = (result[choice] || 0) + 1);
                });
                return result;
            });
    }

    updateChoices(eventId: string, userId: string, newChoices: string[]) {
        let filter = { EventId: eventId, UserId: userId };
        return this._data.update({ Choices: newChoices }, filter)
            .then(resp => {
                if (resp.result !== 1) {
                    return Promise.reject({ message: 'Unexpected number of updated records - check back end' });
                }
                return resp;
            });
    }

    create(eventId: string, userId: string, dateChoices: string[]) {
        let queryStringParams = {
            eventId,
            userId,
            userChoices: JSON.stringify(dateChoices)
        };
        
        return this._elProvider.get.businessLogic.invokeCloudFunction('registerForEvent', { queryStringParams });
    }

    getUserRegistrationForEvent(eventId: string, userId: string) {
        return this._data.get({ EventId: eventId, UserId: userId })
            .then(resp => resp.result[0]);
    }

    getForEvent(eventId: string) {
        return this._data.get({ EventId: eventId }).then(resp => resp.result);
    }

    delete(eventId: string, userId: string) {
        return this._data.destroy({ EventId: eventId, UserId: userId });
    }
}
