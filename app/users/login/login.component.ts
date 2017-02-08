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
    user: { Username: string, Password: string, ConfirmPassword: string, DisplayName: string };
    isSignupView: boolean = false;

    constructor(
        private _usersService: UsersService,
        private _alertsService: AlertService,
        private _routerExtensions: RouterExtensions,
        private _push: PushNotificationsService,
        private _page: Page
    ) {
        this.user = {} as any;
    }

    ngOnInit() {
        this._page.actionBarHidden = true;
    }

    changeView(signupView: boolean) {
        this.user.Username = '';
        this.user.Password = '';
        this.user.DisplayName = '';
        this.user.ConfirmPassword = '';
        this.isSignupView = signupView;
    }

    login() {
        this._usersService.login(this.user.Username, this.user.Password)
            .then((loginResult) => {
                this._push.subscribe(loginResult.result.principal_id).catch(err => err);
                this._routerExtensions.navigate(['events', { clearHistory: true }]);
            })
            .catch((e) => {
                if (e.message && e.message.toLowerCase() === 'invalid username or password.') {
                    e.message = 'Invalid e-mail or password.'; // :|
                }
                this._alertsService.showError(e && e.message);
            });
    }

    signup() {
        if (this.user.Password !== this.user.ConfirmPassword) {
            return this._alertsService.showError('Passwords do not match');
        }

        let errMsg = this._usersService.validateUser(this.user);
        if (errMsg) {
            return this._alertsService.showError(errMsg);
        }

        this._usersService.register(this.user.Username, this.user.Password, this.user.DisplayName)
            .then((res) => {
                this.changeView(false);
            })
            .catch((e) => {
                this._alertsService.showError(e && e.message);
            });
    }

    resetPassword() {
        let email = this.user.Username;
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
