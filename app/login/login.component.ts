import { Component } from '@angular/core'
import { UsersService } from '../services'
import { User } from '../shared'

@Component({
    selector: 'login',
    templateUrl: 'login/login.template.html'
})
export class LoginComponent {
    user: {username?: string, password?: string, confirmPassword?: string};
    isSignupView: boolean = false;

    constructor(
        private _usersService: UsersService
    ) {
        this.user = {};
    }

    changeView(signupView: boolean) {
        this.user.username = '';
        this.user.password = '';
        this.isSignupView = signupView;
    }

    login() {
        this._usersService.login(this.user.username, this.user.password)
            .then(() => console.log('LOGGED IN'))
            .catch((e: Error) => console.error(e.message));
    }

    signup() {
        if (this.user.password !== this.user.confirmPassword) {
            return console.error('Both passwords do not match');
        }

        this._usersService.register(this.user.username, this.user.password)
            .then(() => this.changeView(false))
            .catch((e: Error) => console.error(e.message));
    }
} 