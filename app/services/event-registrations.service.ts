import { Injectable } from '@angular/core';
import { Data } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Data';

import { EverliveProvider } from './everlive-provider.service';
import { EventRegistration } from '../shared/models';

@Injectable()
export class EventRegistrationsService {
    private _data: Data<EventRegistration>;
    private readonly expandExp = {
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

    getParticipants(eventId: string) {
        let query: any = this._elProvider.getNewQuery();
        query.where().eq('EventId', eventId);
        query.expand(this.expandExp);
        query.select('User');
        return this._data.get(query).then(r => r.result.map(r => r.User));
    }

    getEventDateChoiceCounts(eventId: string) {
        return this._data.get({ EventId: eventId })
            .then((res) => {
                let result: any = {};
                res.result.forEach(reg => {
                    reg.Choices.forEach(choice => result[choice] = (result[choice] || 0) + 1);
                });
                return result;
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
}
