import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { GroupsService, AlertService, EverliveProvider, UsersService, PlatformService } from '../../services';
import { Group, User } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'group-details',
    templateUrl: 'groups/group-details/group-details.template.html',
    styleUrls: ['groups/group-details/group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
    group: Group;
    hasJoined: boolean = null;
    members: User[] = [];
    isAndroid: boolean = false;
    private _currentUser: User;

    constructor(
        private _usersService: UsersService,
        private _activatedRoute: ActivatedRoute,
        private _alertsService: AlertService,
        private _everliveProvider: EverliveProvider,
        private _routerExtensions: RouterExtensions,
        private _platform: PlatformService,
        private _groupsService: GroupsService,
        private _page: Page
    ) {
        this.isAndroid = this._platform.isAndroid;
    }

    ngOnInit() {
        this._page.actionBar.title = '';
        this._activatedRoute.params.subscribe(p => {
            let groupId = p['id'];

            let userPrm = this._usersService.currentUser()
                .then(user => this._currentUser = user);

            let groupPrm = this._groupsService.getById(groupId)
                .then(group => {
                    this.group = group;
                    this._page.actionBar.title = this.group.Name;
                });

            Promise.all<any>([userPrm, groupPrm])
                .then(() => this._groupsService.getGroupMembers(this.group.Id))
                .then(members => {
                    this.hasJoined = members.some(m => m.Id === this._currentUser.Id);
                    this.members = members;
                })
                .then(() => {
                    let promise = Promise.resolve(false);

                    if (!this.hasJoined && p['joinRedirect']) { // join if its a join redirect
                        promise = this._groupsService.joinGroup(this.group.Id, this._currentUser.Id);
                    }

                    return promise;
                })
                .then((result) => {
                    if (result === false) { // was not a join redirect or was already a member
                        return;
                    }

                    if (this.group.RequiresApproval && p['joinRedirect']) {
                        this._alertsService.showSuccess(`Request to join "${this.group.Name}" sent`);
                    }

                    this._addCurrentUserAsRegistered();
                })
                .catch(err => {
                    this._alertsService.showError(err && err.message);
                });;
        });
    }

    getRemainingText() {
        let remainingCount = Math.max(0, this.members.length - 5);
        if (remainingCount) {
            return `and ${remainingCount} more`;
        }
        return '';
    }

    canEdit() {
        return this.group && this._currentUser && this.group.Owner === this._currentUser.Id;
    }

    onEdit() {
        this._routerExtensions.navigateByUrl(`groups/${this.group.Id}/edit`);
    }

    getJoinBtnText() {
        return this.group.RequiresApproval ? 'Ask to join' : 'Join';
    }

    getDetailsText() {
        let text = `This group is ${this.group.IsPublic ? 'public' : 'private'} and ${this.group.RequiresApproval ? 'requires approval' : 'does not require approval'} to join.`;
        return text;
    }

    onViewEvents() {
        this._routerExtensions.navigate([`groups/${this.group.Id}/events`]);
    }

    onViewRequests() {
        this._alertsService.showError('Not implemented yet. Please follow the development :)');
    }

    onJoin() {
        this._groupsService.joinGroup(this.group.Id, this._currentUser.Id)
            .then((resp) => {
                if (this.group.RequiresApproval) {
                    this._alertsService.showSuccess(`Request to join "${this.group.Name}" sent`);
                } else {
                    this._addCurrentUserAsRegistered();
                }
            })
            .catch((err) => {
                this._alertsService.showError(err && err.message);
            });
    }

    onLeave() {
        this._groupsService.leaveGroup(this.group.Id, this._currentUser.Id)
            .then(() => {
                this.hasJoined = false;
                this.members = this.members.filter(m => m.Id !== this._currentUser.Id);
             })
            .catch((err) => {
                this._alertsService.showError(err && err.message);
            });
    }

    onMembersTap() {
        this._routerExtensions.navigateByUrl(`/groups/${this.group.Id}/members`);
    }

    onBack() {
        this._routerExtensions.navigateByUrl(`/groups`);
    }

    private _addCurrentUserAsRegistered() {
        this.hasJoined = true;
        let clone = this.members.slice(0);
        clone.push(this._currentUser);
        this.members = clone;
    }
}
