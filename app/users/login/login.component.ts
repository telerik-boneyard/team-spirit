import { Component, OnInit } from '@angular/core'
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';
import { UsersService, AlertService, EverliveProvider, PushNotificationsService } from '../../services';

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
        this.user = { username: 'georgip', password: 'qweqwe' };
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

        this._usersService.register(this.user.username, this.user.password)
            .then((res) => {
                this.changeView(false)
            })
            .catch((e) => {
                this._alertsService.showError(e && e.message);
            });
    }
}
