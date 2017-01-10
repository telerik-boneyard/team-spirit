import { Component, OnInit } from '@angular/core';

import { User } from '../../shared';
import { UsersService } from '../../services';

@Component({
    selector: 'user-details',
    templateUrl: 'users/user-details/user-details.template.html'
})
export class UserDetailsComponent implements OnInit {
    user: User;

    constructor(
        private _usersService: UsersService,
    ) {} 

    ngOnInit() {
        this._usersService.currentUser()
            .then(u => this.user = u)
            .catch(e => console.error(e.message));
    }

    save() {
        this._usersService.updateUser(this.user);
    }

    getResizedImageUrl(rawUrl: string) {

    }
}
