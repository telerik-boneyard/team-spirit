import { Injectable } from '@angular/core';
import { Data } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Data';

import { EverliveProvider } from './';
import { Group, GroupMembership } from '../shared/models';

@Injectable()
export class GroupsService {
    private _membershipsData: Data<GroupMembership>;
    private _groupsData: Data<Group>;
    private _expandMemberships: any = {
        GroupId: {
            TargetTypeName: 'Groups',
            ReturnAs: 'Group'
        }
    };
    
    constructor(
        private _elProvider: EverliveProvider
    ) {
        this._membershipsData = this._elProvider.getData<GroupMembership>('GroupMembers');
        this._groupsData = this._elProvider.getData<Group>('Groups');
    }

    getGroupsByFilter(filter: any) {
        let query = this._elProvider.getNewQuery();
        query.where(filter);
        return this._groupsData.get(query);
    }
    
    getGroupsByUserId(userId: string) {
        let query = this._elProvider.getNewQuery();
        query.where({ UserId: userId });
        query.expand(this._expandMemberships);
        
        return this._membershipsData.get(query).then(r => r.result.map(gm => gm.Group));
    }

    private _getGroupsFilterByMemberships(groupMemberships: GroupMembership[]) {
        return this.getGroupsByFilter({
            Id: { $in: groupMemberships.map(gr => gr.GroupId) }
        });
    }
}
