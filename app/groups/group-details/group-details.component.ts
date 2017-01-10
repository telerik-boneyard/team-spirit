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
            this._groupsService.getById(p['id'])
                .then(group => {
                    this.group = group;
                    return this._usersService.currentUser()
                })
                .then(user => {
                    this._currentUser = user;
                    return this._groupsService.isUserAMember(user.Id, this.group.Id);
                })
                .then(isMember => this.hasJoined = isMember)
                .catch(err => {
                    this._alertsService.showError(err && err.message);
                });;
        });
    }

    getResizedImageUrl(rawUrl: string) {
        return utilities.getAsResizeUrl(rawUrl);
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

    onJoin() {
        this._groupsService.joinGroup(this.group.Id, this._currentUser.Id)
            .then((resp) => {
                this.hasJoined = true;
            })
            .catch((err) => {
                this._alertsService.showError(err && err.message);
            });
    }

    onLeave() {
        this._groupsService.leaveGroup(this.group.Id, this._currentUser.Id)
            .catch((err) => {
                this._alertsService.showError(err && err.message);
            });
    }
}
