import { Component } from '@angular/core'
import { UsersService } from '../services'

@Component({
    selector: 'login',
    templateUrl: 'login/login.template.html'
})
export class LoginComponent {
    username: string;
    password: string;

    constructor(
        private _usersService: UsersService
    ) {}

    login() {
        this._usersService.login(this.username, this.password)
            .then(() => console.log('LOGGED IN'))
            .catch(e => console.error(e.message));
    }
} 