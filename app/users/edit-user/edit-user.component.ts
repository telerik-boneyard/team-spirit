import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { User, Group } from '../../shared';
import { utilities } from '../../shared';
import {
    UsersService,
    GroupsService,
    AlertService,
    FilesService
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
        private _filesService: FilesService,
        private _groupsService: GroupsService,
        private _page: Page
    ) {}

    ngOnInit() {
        this._page.actionBar.title = 'Edit Profile';
        this._usersService.currentUser()
            .then(u => this.user = u)
    }

    save() {
        this._alertsService.askConfirmation('Update your entire profile?')
            .then(() => {
                let promise = Promise.resolve<any>(false);
                if (utilities.isLocalFileUrl(this.user.ImageUrl)) {
                    promise = this._filesService.uploadFromUri(this.user.ImageUrl);
                }
                return promise;
            })
            .then(uploadResult => {
                if (uploadResult) {
                    this.user.Image = uploadResult.Id
                }
                return this._usersService.updateUser(this.user);
            })
            .then(res => this._alertsService.showSuccess('Details updated'))
            .then(() => this._routerExtensions.navigateByUrl('user'))
            .catch(err => err && this._alertsService.showError(err));
    }

    onImageUpload(createdImage: { Uri: string, Id: string }) {
        this.user.Image = createdImage.Id;
        this._usersService.updateUser(this.user);
    }

    onCancel() {
        this._routerExtensions.back();
    }
}
