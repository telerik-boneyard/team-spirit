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
    selector: 'edit-user',
    templateUrl: 'users/edit-user/edit-user.template.html',
    styleUrls: [ 'users/edit-user/edit-user.component.css' ]
})
export class EditUserComponent implements OnInit {
    user: User;

    constructor(
        private _routerExtensions: RouterExtensions,
        private _usersService: UsersService,
        private _alertsService: AlertService,
        private _groupsService: GroupsService
    ) {}
    
    ngOnInit() {
        this._usersService.currentUser()
            .then(u => this.user = u)
    }

    save() {
        this._alertsService.askConfirmation('Update your entire profile?')
            .then(() => this._usersService.updateUser(this.user))
            .then(res => this._alertsService.showSuccess('Details updated'))
            .then(() => this._routerExtensions.navigateByUrl('user'))
            .catch(err => err && this._alertsService.showError(err));
    }

    onImageUpload(createdImage: { Uri: string, Id: string }) {
        this.user.Image = createdImage.Id;
        this._usersService.updateUser(this.user);
    }
}
