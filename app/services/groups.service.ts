import { Injectable } from '@angular/core';
import { Data } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Data';

import { EverliveProvider } from './';
import { Group, GroupMembership, User, GroupJoinRequest } from '../shared/models';
import { utilities } from '../shared';

@Injectable()
export class GroupsService {
    private _membershipsData: Data<GroupMembership>;
    private _groupsData: Data<Group>;
    private _groupJoinRequests: Data<GroupJoinRequest>;
    private readonly _imageExpandExp = {
        Image: {
            TargetTypeName: 'Files',
            SingleField: 'Uri',
            ReturnAs: 'ImageUrl'
        }
    };
    private readonly _expandGroupInMembership = {
        GroupId: {
            TargetTypeName: 'Groups',
            ReturnAs: 'Group',
            Expand: this._imageExpandExp
        }
    };
    private readonly _expandUserInMembership = {
        UserId: {
            TargetTypeName: 'Users',
            ReturnAs: 'User',
            Expand: this._imageExpandExp
        }
    };
    
    constructor(
        private _elProvider: EverliveProvider
    ) {
        this._groupsData = this._elProvider.getData<Group>('Groups');
        this._membershipsData = this._elProvider.getData<GroupMembership>('GroupMembers');
        this._groupJoinRequests = this._elProvider.getData<GroupJoinRequest>('GroupJoinRequests');
    }

    create(group: Group) {
        group = this._sanitizeGroup(group);
        group.IsPublic = true; // TODO: remove once the concept is implemented
        return this._groupsData.create(group).then(res => res.result);
    }

    getById(id: string, expand = true) {
        if (expand) {
            this._groupsData.expand(this._imageExpandExp);
        }
        return this._groupsData.getById(id).then(r => r.result);
    }

    getAllVisible(userId: string): Promise<Group[]|number>
    getAllVisible(userId: string, justCount: boolean): Promise<number>
    getAllVisible(userId: string, justCount = false): Promise<Group[]|number> {
        let filter = {
            $or: [
                { IsPublic: true },
                { Owner: userId }
            ]
        };
        let func = justCount ? this._groupsData.count : this._groupsData.get;
        return func.call(this._groupsData, filter).then(res => res.result);
    }

    getUserCountByGroup(userId: string): Promise<{GroupId: string, UserId: number}[]> {
        let query = this._elProvider.getNewAggregateQuery();
        query.groupBy('GroupId').count('UserId');
        return this._membershipsData.aggregate(query)
            .then((res: any) => res.result);
    }

    getUnjoinedGroups(userId: string, page?: number, pageSize?: number) {
        return this._membershipsData.get({ UserId: userId })
            .then(memberships => {
                let ids = memberships.result.map(m => m.GroupId);
                let filter = {
                    $and: [
                        { Id: { $nin: ids } },
                        { $or: [ { IsPublic: true }, { Owner: userId } ] }
                    ]
                };
                return this._getGroupsByFilter(filter, null, page, pageSize);
            });
    }
    
    getUserGroups(userId: string, page?: number, pageSize?: number) {
        return this._membershipsData.get({ UserId: userId })
            .then(resp => {
                let userGroupsIds = resp.result.map(reg => reg.GroupId);
                return this._getGroupsByFilter({ Id: { $in: userGroupsIds }}, null, page, pageSize);
            });
    }

    getGroupMembers(groupId: string) {
        let query = this._elProvider.getNewQuery();
        query.where({ GroupId: groupId });
        query.expand(this._expandUserInMembership);
        return this._membershipsData.get(query).then(resp => {
            let result: User[] = [];
            resp.result.forEach(gm => gm.User && result.push(gm.User));
            return result;
        });
    }
    
    isUserAMember(userId: string, groupId: string): Promise<boolean>
    isUserAMember(userId: string, group: Group): Promise<boolean>
    isUserAMember(user: User, groupId: string): Promise<boolean>
    isUserAMember(user: User, group: Group): Promise<boolean>
    isUserAMember(userData: string|User, groupData: string|Group): Promise<boolean> {
        let userId: string;
        let groupId: string;
        
        if (typeof userData === 'string') {
            userId = userData
        } else {
            userId = userData.Id;
        }

        if (typeof groupData === 'string') {
            groupId = groupData;
        } else {
            groupId = groupData.Id;
        }

        return this._membershipsData.get({ UserId: userId, GroupId: groupId })
            .then(resp => resp.count > 0);
    }

    update(group: Group) {
        group = this._sanitizeGroup(group);
        group.IsPublic = true; // TODO: remove once this is an active concept
        return this._groupsData.updateSingle(group).then(r => r.result);
    }

    delete(id: string) {
        return this._groupsData.destroySingle(id).then(r => r.result);
    }

    getApplication(groupId: string, userId: string) {
        let query = this._elProvider.getNewQuery();
        query.where({ GroupId: groupId, ApplicantId: userId });
        query.expand({ ApplicantId: { ReturnAs: 'Applicant' } });
        return this._groupJoinRequests.get(query)
            .then(resp => resp.result[0]);
    }

    getUserApplications(userId: string, groupIds?: string[]) {
        let filter: any = { ApplicantId: userId };
        if (groupIds && groupIds.length) {
            filter.GroupId = { $in: groupIds };
        }
        return this._groupJoinRequests.get(filter)
            .then(r => r.result);
    }

    getRequests(groupId: string, page = 0, pageSize = 10, expandExp?: any) {
        expandExp = expandExp || {
            ApplicantId: {
                TargetTypeName: 'Users',
                ReturnAs: 'Applicant',
                Expand: this._imageExpandExp
            }
        };
        let query = this._elProvider.getNewQuery()
            .where({ GroupId: groupId, Resolved: false })
            .skip(page * pageSize)
            .take(pageSize)
            .orderDesc('CreatedAt')
            .expand(expandExp);
        return this._groupJoinRequests.get(query).then(r => r.result);
    }

    getUnresolvedRequestsCount(groupId: string) {
        return this._groupJoinRequests.count({ GroupId: groupId, Resolved: false })
            .then(r => r.result);
    }

    resolveJoinRequest(requestId: string, approved: boolean) {
        let queryStringParams = {
            reqId: requestId,
            approved: approved
        };
        return this._elProvider.get.businessLogic.invokeCloudFunction('resolveUserJoinRequest', { queryStringParams });
    }

    validateGroupEntry(group: Group) {
        let errMsg: string = null;

        if (!utilities.isNonemptyString(group.Name)) {
            errMsg = 'Group name is invalid';
        }

        return errMsg;
    }

    joinGroup(groupId: string, userId: string) {
        let queryStringParams = { userId, groupId };
        return this._elProvider.get.businessLogic.invokeCloudFunction('requestToJoinGroup', { queryStringParams });
    }

    leaveGroup(groupId: string, userId: string) {
        let query = this._elProvider.getNewQuery();
        query.where({
            UserId: userId,
            GroupId: groupId
        });
        return this._membershipsData.destroy(query).then(r => {
            if (r.result === 1) {
                return true;
            } else {
                if (r.result > 1) {
                    console.log('Deleted more than one registration - cant be good');
                    console.log('resp: ' + JSON.stringify(r));
                }
                return Promise.reject({ message: 'You are not part of this group' });
            }
        });
    }

    private _mergeGroups(ownedAndPublic: Group[], joinedGroups: Group[]) {
        let joinedById: any = {};
        joinedGroups.forEach(jg => joinedById[jg.Id] = true);
        ownedAndPublic.forEach(g => {
            if (!joinedById[g.Id]) {
                joinedGroups.push(g);
            }
        });
        return joinedGroups;
    }

    private _getGroupsByFilter(filter: any, sorting?: { field: string, desc?: boolean }|{ field: string, desc?: boolean }[], page?: number, pageSize?: number) {
        let query = this._elProvider.getNewQuery();
        query.where(filter);
        query.expand(this._imageExpandExp);

        sorting = sorting || [{ field: 'Name' }];
        sorting = [].concat(sorting);
        sorting.forEach(sortType => {
            let sortFunc = sortType.desc ? query.orderDesc : query.order;
            sortFunc.call(query, sortType.field);
        });
        if (typeof page === 'number') {
            query.skip(page * pageSize);
        }
        if (typeof pageSize === 'number') {
            query.take(pageSize);
        }

        return this._groupsData.get(query).then(res => res.result);
    }

    private _sanitizeGroup(group: Group) {
        delete group.ImageUrl;
        return group;
    }
}
