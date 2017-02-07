import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { User } from '../../shared';
import { utilities } from '../../shared';
import { UsersService, AlertService } from '../../services';

@Component({
    selector: 'settings',
    templateUrl: 'settings/settings/settings.template.html',
    styleUrls: [ 'settings/settings/settings.component.css' ]
})
export class SettingsComponent implements OnInit {
    user: { PushNotificationsEnabled: boolean, EmailNotificationsEnabled: boolean } = {} as any;
    private _currentUser: User;

    constructor(
        private _usersService: UsersService,
        private _alertsService: AlertService,
        private _page: Page
    ) {}

    ngOnInit() {
        this._page.actionBar.title = 'Settings';
        this._usersService.currentUser().then(user => {
            this._currentUser = user;
            this.user = {
                PushNotificationsEnabled: this._currentUser.PushNotificationsEnabled,
                EmailNotificationsEnabled: this._currentUser.EmailNotificationsEnabled
            };
        });
    }

    onSave() {
        let updateObj = {
            Id: this._currentUser.Id,
            PushNotificationsEnabled: this.user.PushNotificationsEnabled,
            EmailNotificationsEnabled: this.user.EmailNotificationsEnabled
        };
        this._usersService.updateUser(updateObj)
            .then(() => this._alertsService.showSuccess('Settings saved'))
            .catch(err => {
                if (err) {
                    this._alertsService.showError(err.message);
                }
                this.user.EmailNotificationsEnabled = this._currentUser.EmailNotificationsEnabled;
                this.user.PushNotificationsEnabled = this._currentUser.PushNotificationsEnabled;
            });
    }
}
