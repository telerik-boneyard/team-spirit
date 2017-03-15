import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { User } from '../../shared';
import { utilities } from '../../shared';
import { UsersService, AlertService } from '../../services';

@Component({
    moduleId: module.id,
    selector: 'settings',
    templateUrl: './settings.template.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    user: { PushNotificationsEnabled: boolean, EmailNotificationsEnabled: boolean } = {} as any;
    private _currentUserId: string;
    private _pushEnabled: boolean;
    private _emailEnabled: boolean;

    constructor(
        private _usersService: UsersService,
        private _alertsService: AlertService,
        private _page: Page
    ) {}

    get pushEnabled() {
        return this._pushEnabled;
    }

    get emailEnabled() {
        return this._emailEnabled;
    }

    set pushEnabled(val: boolean) {
        if (typeof this._pushEnabled === 'boolean') { // dont update on initialization
            this._updateSettings(val, this.emailEnabled);
        }
        this._pushEnabled = val;
    }

    set emailEnabled(val: boolean) {
        if (typeof this._emailEnabled === 'boolean') { // dont update on initialization
            this._updateSettings(this.pushEnabled, val);
        }
        this._emailEnabled = val;
    }

    ngOnInit() {
        this._page.actionBar.title = 'Settings';
        this._usersService.currentUser().then(user => {
            this._currentUserId = user.Id;
            this._pushEnabled = user.PushNotificationsEnabled;
            this._emailEnabled = user.EmailNotificationsEnabled;
        });
    }

    private _updateSettings(pushEnabled: boolean, emailEnabled: boolean) {
        let updateObj = {
            Id: this._currentUserId,
            PushNotificationsEnabled: pushEnabled,
            EmailNotificationsEnabled: emailEnabled
        };
        this._usersService.updateUser(updateObj)
            .catch(err => err && this._alertsService.showError(err.message));
    }
}
