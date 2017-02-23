import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ScrollView } from 'ui/scroll-view';

import { GroupsService, UsersService, AlertService, EventsService } from '../../services';
import { Group, User } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'group-list',
    templateUrl: './group-list.template.html',
    styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit, OnChanges {
    @Input() groups: Group[];
    @Input() hasMore: boolean = true;
    @Input() areUserGroups: boolean;
    @Output() onGroupTap: EventEmitter<Group> = new EventEmitter<Group>();
    @Output() scrolledToBottom: EventEmitter<any> = new EventEmitter<any>();

    groupInfoById: any = {};
    initialized = false;
    // UserId is actually the count, due to expand expression imperfection
    private _groupData: { GroupId: string, UserId: number }[];

    constructor(
        private _routerExtensions: RouterExtensions,
        private _eventsService: EventsService,
        private _groupsService: GroupsService,
        private _alertsService: AlertService,
        private _usersService: UsersService
    ) {}

    ngOnInit() {
        this._updateGroupsSubtextData().then(() => this.initialized = true);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['groups']) {
            this._updateGroupsSubtextData();
        }
    }

    groupTap(clickedGroup: Group) {
        this.onGroupTap.emit(clickedGroup);
    }

    getJoinBtnText(group: Group) {
        return group.RequiresApproval ? 'Ask to join' : 'Join now';
    }

    onJoin(group: Group) {
        let user: User;
        this._usersService.currentUser()
            .then(u => {
                user = u;
                return this._groupsService.isUserAMember(u.Id, group.Id);
            })
            .then(isMember => {
                if (isMember) {
                    return Promise.reject({ message: 'Already a member' });
                } else {
                    this._routerExtensions.navigate([`/groups/${group.Id}`, { joinRedirect: true }]);
                }
            })
            .catch(err => this._alertsService.showError(err && err.message));
    }

    getSubtext(group: Group) {
        let count: number = this.groupInfoById[group.Id];        
        let postfix = this.areUserGroups ? ' upcoming event' : ' user';
        if (count !== 1) {
            postfix += 's';
        }
        return (count || 'No') + postfix;
    }

    onLoadMore() {
        this.scrolledToBottom.emit();
    }

    private _updateGroupsSubtextData() {
        return this.areUserGroups ? this._getUpcomingEvents() : this._getUserCountByGroup();
    }

    private _getUserCountByGroup() {
        let prm = Promise.resolve(this._groupData);

        if (!this._groupData) {
            prm = this._usersService.currentUser()
                .then(u => this._groupsService.getUserCountByGroup(u.Id));
        }

        return prm.then(groupData => {
                this.groups.forEach((g) => {
                    let data = utilities.find(groupData, gd => gd.GroupId === g.Id);
                    if (data) {
                        this._addGroupInfo(g.Id, data.UserId); // UserId is the count
                    }
                });
            })
            .catch(err => {this._alertsService.showError(err.message)});
    }

    private _getUpcomingEvents() {
        let ids = this.groups.map(g => g.Id);
        return this._eventsService.getUpcomingCountsByGroups(ids)
            .then(evData => {
                evData.forEach(d => {
                    this._addGroupInfo(d.GroupId, d.Name);
                });
            });
    }

    private _addGroupInfo(groupId: string, value: number) {
        this.groupInfoById[groupId] = value;
    }
}
