import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

import { User, Group } from '../../shared';
import { utilities } from '../../shared';
import {
    UsersService,
    GroupsService,
    AlertService
} from '../../services';

@Component({
    selector: 'user-details',
    templateUrl: 'users/user-details/user-details.template.html',
    styleUrls: [ 'users/user-details/user-details.component.css' ]
})
export class UserDetailsComponent implements OnInit {
    user: User;
    userGroups: Group[] = [];
    membershipExpanded = false;

    constructor(
        private _routerExtensions: RouterExtensions,
        private _usersService: UsersService,
        private _alertsService: AlertService,
        private _groupsService: GroupsService
    ) {} 

    ngOnInit() {
        this._usersService.currentUser()
            .then(u => this.user = u)
            .then(() => this._groupsService.getUserGroups(this.user.Id))
            .then(groups => this.userGroups = groups)
            .catch(e => this._alertsService.showError(e && e.message));
    }

    onEdit() {
        this._routerExtensions.navigateByUrl('user/edit');
    }

    getResizedImageUrl() {
        return utilities.getAsResizeUrl(this.user.ImageUrl, { width: 250, height: 250 });
    }

    getUserDisplayName() {
        return this.user && (this.user.DisplayName || this.user.Username);
    }

    getRemainingGroupsText() {
        return ` and ${this.userGroups.length - 1} more`;
    }

    toggleExpandedMembership() {
        this.membershipExpanded = !this.membershipExpanded;
    }

    getAllMembershipNames() {
        return this.userGroups.map(g => g.Name).join(', ');
    }
}
