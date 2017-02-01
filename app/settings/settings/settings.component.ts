import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

import { User } from '../../shared';
import { utilities } from '../../shared';
import { UsersService, AlertService } from '../../services';

@Component({
    selector: 'settings',
    templateUrl: 'settings/settings/settings.template.html',
    styleUrls: [ 'settings/settings/settings.component.css' ]
})
export class SettingsComponent implements OnInit {
    user: User;
    
    constructor(
        private _usersService: UsersService,
        private _alertsService: AlertService
    ) {}
    
    ngOnInit() {
        this._usersService.currentUser().then(user => this.user = user);
    }

    onSave() {
        this._usersService.updateUser(this.user)
            .then(() => this._alertsService.showSuccess('Settings saved'))
            .catch(err => err && this._alertsService.showError(err.message));
    }
}
