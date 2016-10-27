import { Component, OnInit } from '@angular/core'
import { RouterExtensions } from 'nativescript-angular/router'
import { Page } from 'ui/page'
import { UsersService } from '../services'
import { User } from '../shared'

@Component({
    selector: 'login',
    templateUrl: 'login/login.template.html',
    styleUrls: ['login/login.component.css']
})
export class LoginComponent implements OnInit {
    user: {username?: string, password?: string, confirmPassword?: string};
    isSignupView: boolean = false;

    constructor(
        private _usersService: UsersService,
        private _routerExtensions: RouterExtensions,
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
            .then(() => {
                console.log('LOGGED IN')
                this._routerExtensions.navigate(['events/upcoming']);
            })
            .catch((e: Error) => {
                console.error(e.message)
            });
    }

    signup() {
        if (this.user.password !== this.user.confirmPassword) {
            return console.error('Passwords do not match');
        }

        this._usersService.register(this.user.username, this.user.password)
            .then((res) => {
                this.changeView(false)
            })
            .catch((e: Error) => {
                console.error(e.message)
            });
    }
}
