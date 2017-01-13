import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { GroupsService, AlertService, EverliveProvider, UsersService } from '../../services';
import { Group, User } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'group-details',
    templateUrl: 'groups/group-details/group-details.template.html',
    styleUrls: ['groups/group-details/group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
    group: Group;
    hasJoined: boolean = false;
    members: User[] = [];
    private _currentUser: User;

    constructor(
        private _usersService: UsersService,
        private _activatedRoute: ActivatedRoute,
        private _alertsService: AlertService,
        private _everliveProvider: EverliveProvider,
        private _routerExtensions: RouterExtensions,
        private _groupsService: GroupsService
    ) {}

    ngOnInit() {
        this._activatedRoute.params.subscribe(p => {
            this._usersService.currentUser()
                .then(user => {
                    this._currentUser = user;
                    return this._groupsService.getById(p['id']);
                })
                .then(group => {
                    this.group = group;
                    let promise = Promise.resolve(false);

                    if (p['joinRedirect']) { // join if its a join redirect
                        promise = this._groupsService.joinGroup(this.group.Id, this._currentUser.Id);
                    }

                    return promise;
                })
                .then(() => {
                    if (this.group.RequiresApproval && p['joinRedirect']) {
                        this._alertsService.showSuccess('Request to join sent');
                    }
                    
                    return this._groupsService.getGroupMembers(this.group.Id);
                })
                .then(members => {
                    this.hasJoined = members.some(m => m.Id === this._currentUser.Id);
                    this.members = members;
                })
                .catch(err => {
                    this._alertsService.showError(err && err.message);
                });;
        });
    }

    getResizedImageUrl(rawUrl: string, size?) {
        return utilities.getAsResizeUrl(rawUrl, size);
    }

    getApprovalBtnText() {
        return this.group.RequiresApproval ? 'Approval' : 'No Approval';
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
        this._routerExtensions.navigateByUrl(`groups/edit/${this.group.Id}`);
    }

    getJoinBtnText() {
        return this.group.RequiresApproval ? 'request to join' : 'join';
    }

    onViewEvents() {
        console.log('go to events clicked');
    }

    onJoin() {
        this._groupsService.joinGroup(this.group.Id, this._currentUser.Id)
            .then((resp) => {
                if (!this.group.RequiresApproval) {
                    this.hasJoined = true;
                    this.members.push(this._currentUser);
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
                this._alertsService.showSuccess(`Left group ${this.group.Name}`);
             })
            .catch((err) => {
                this._alertsService.showError(err && err.message);
            });
    }
}
