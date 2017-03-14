import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { User, Group } from '../../shared';
import { utilities } from '../../shared';
import {
    UsersService,
    GroupsService,
    AlertService
} from '../../services';

@Component({
    moduleId: module.id,
    selector: 'user-details',
    templateUrl: './user-details.template.html',
    styleUrls: [ './user-details.component.css' ]
})
export class UserDetailsComponent implements OnInit {
    user: User;
    userGroups: Group[] = [];
    membershipExpanded = false;

    constructor(
        private _routerExtensions: RouterExtensions,
        private _usersService: UsersService,
        private _alertsService: AlertService,
        private _groupsService: GroupsService,
        private _page: Page
    ) {}

    ngOnInit() {
        this._page.actionBar.title = 'My profile';
        this._usersService.currentUser()
            .then(u => this.user = u)
            .then(() => this._groupsService.getUserGroups(this.user.Id))
            .then(groups => this.userGroups = groups)
            .catch(e => this._alertsService.showError(e && e.message));
    }

    onEdit() {
        let transition = utilities.getPageTransition();
        this._routerExtensions.navigate(['user/edit'], { transition });
    }

    getResizedImageUrl() {
        return utilities.getAsResizeUrl(this.user.ImageUrl, { width: 250, height: 250 });
    }

    getUserDisplayName() {
        return this.user && (this.user.DisplayName || this.user.Username);
    }

    getRemainingGroupsText() {
        return `and ${this.userGroups.length - 1} more`;
    }

    toggleExpandedMembership() {
        this.membershipExpanded = !this.membershipExpanded;
    }

    getAllMembershipNames() {
        return this.userGroups.map(g => g.Name).join(', ');
    }
}
