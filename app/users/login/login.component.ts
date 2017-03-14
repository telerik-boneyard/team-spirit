import { Component, OnInit, ViewContainerRef } from '@angular/core'
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { utilities } from '../../shared';
import { PasswordResetModalComponent } from '../';
import {
    UsersService,
    AlertService,
    EverliveProvider,
    PushNotificationsService
} from '../../services';

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: './login.template.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    user: { Username: string, Password: string, ConfirmPassword: string, DisplayName: string };
    isSignupView: boolean = false;

    constructor(
        private _usersService: UsersService,
        private _alertsService: AlertService,
        private _routerExtensions: RouterExtensions,
        private _push: PushNotificationsService,
        private _vcRef: ViewContainerRef,
        private _page: Page
    ) {
        this.user = {} as any;
        this._page.actionBarHidden = true;
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
                this._goToEvents();
            })
            .catch((e) => {
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
                this._alertsService.showSuccess('Welcome to TeamUP!');
                return this._usersService.login(this.user.Username, this.user.Password);
            })
            .then(() => {
                this._goToEvents();
            })
            .catch((err) => {
                if (err) {
                    if (err.code === 201) {
                        err.message = 'A user with the same email address already exists.';
                    }
                    this._alertsService.showError(err.message);
                }
            });
    }

    resetPassword() {
        this._alertsService.showModal({}, this._vcRef, PasswordResetModalComponent)
            .then((email: string) => this._usersService.resetUserPassword(email))
            .then(() => {
                let ctx = {
                    title: 'Password request sent',
                    text: 'We have sent instructions to the email address that you provided.',
                    buttons: { ok: 'OK, thanks!' },
                    fullscreen: false
                };
                return this._alertsService.showModal(ctx, this._vcRef);
            })
            .catch(err => err && this._alertsService.showError(err.message));
    }

    private _goToEvents() {
        let transition = utilities.getPageTransition();
        this._routerExtensions.navigate(['events'], { clearHistory: true, transition });
    }
}
