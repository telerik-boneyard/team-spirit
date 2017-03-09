import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { UsersService } from './users.service';
import { utilities } from '../shared';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private _usersService: UsersService,
        private _router: RouterExtensions
    ) {}

    canActivate() {
        return this._usersService.currentUser()
            .then(u => {
                let isLoggedIn = !!u;
                if (!isLoggedIn) {
                    let transition = utilities.getReversePageTransition();
                    this._router.navigate(['user/login'], { transition });
                }
                return isLoggedIn;
            });
    }
}
