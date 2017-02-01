import { Component, OnInit } from '@angular/core'
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { UsersService, AlertService, EverliveProvider, PushNotificationsService } from '../../services';
import { utilities } from '../../shared';

@Component({
    selector: 'login',
    templateUrl: 'users/login/login.template.html',
    styleUrls: ['users/login/login.component.css']
})
export class LoginComponent implements OnInit {
    user: {username?: string, password?: string, confirmPassword?: string};
    isSignupView: boolean = false;

    constructor(
        private _usersService: UsersService,
        private _alertsService: AlertService,
        private _routerExtensions: RouterExtensions,
        private _push: PushNotificationsService,
        private _page: Page
    ) {
        this.user = {};
    }

    ngOnInit() {
        this._page.actionBarHidden = true;
        this._page.backgroundImage = 'res://background';
    }

    changeView(signupView: boolean) {
        this.user.username = '';
        this.user.password = '';
        this.isSignupView = signupView;
    }

    login() {
        this._usersService.login(this.user.username, this.user.password)
            .then((loginResult) => {
                this._push.subscribe(loginResult.result.principal_id).catch(err => err);
                this._routerExtensions.navigate(['events', { clearHistory: true }]);
            })
            .catch((e) => {
                this._alertsService.showError(e && e.message);
            });
    }

    signup() {
        if (this.user.password !== this.user.confirmPassword) {
            return this._alertsService.showError('Passwords do not match');
        }

        let errMsg = this._usersService.validateUser(this.user);
        if (errMsg) {
            return this._alertsService.showError(errMsg);
        }

        this._usersService.register(this.user.username, this.user.password)
            .then((res) => {
                this.changeView(false);
                this.user.confirmPassword = '';
            })
            .catch((e) => {
                this._alertsService.showError(e && e.message);
            });
    }

    resetPassword() {
        let email = this.user.username;
        if (!email || !utilities.isEmail(email)) {
            return this._alertsService.showError('Invalid email');
        }
        
        this._alertsService.askConfirmation('This will reset your password')
            .then(() => this._usersService.resetUserPassword(email), err => err)
            .then(wasReset => {
                if (wasReset) {
                    this._alertsService.showSuccess('Password reset email was sent');
                }
            })
            .catch(this._getErrHandler());
    }

    private _getErrHandler() {
        return (err) => {
            this._alertsService.showError(err && err.message);
        }
    }
}
