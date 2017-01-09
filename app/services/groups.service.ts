import { Injectable } from '@angular/core';
import { Data } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Data';

import { EverliveProvider } from './';
import { Group, GroupMembership } from '../shared/models';

@Injectable()
export class GroupsService {
    private _membershipsData: Data<GroupMembership>;
    private _groupsData: Data<Group>;
    private readonly _expandMemberships: any = {
        GroupId: {
            TargetTypeName: 'Groups',
            ReturnAs: 'Group'
        }
    };
    private readonly _groupImageExpand: any = {
        Image: {
            TargetTypeName: 'Files',
            SingleField: 'Uri',
            ReturnAs: 'ImageUrl'
        }
    };
    
    constructor(
        private _elProvider: EverliveProvider
    ) {
        this._membershipsData = this._elProvider.getData<GroupMembership>('GroupMembers');
        this._groupsData = this._elProvider.getData<Group>('Groups');
    }

    getNonPrivate() {
        let filter = {
            IsPublic: true
        };
        return this._getGroupsByFilter(filter);
    }
    
    getUserGroups(userId: string) {
        let query = this._elProvider.getNewQuery();
        query.where({ UserId: userId });
        query.expand(this._expandMemberships);
        
        return this._membershipsData.get(query).then(r => r.result.map(gm => gm.Group));
    }

    private _getGroupsByFilter(filter: any) {
        let query = this._elProvider.getNewQuery();
        query.where(filter);
        query.expand(this._groupImageExpand);
        return this._groupsData.get(query).then(res => res.result);
    }
}
