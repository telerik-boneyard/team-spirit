import { Component, OnInit } from '@angular/core';
import { User } from '../shared';
import { UsersService } from '../services'

@Component({
    selector: 'user-details',
    templateUrl: 'user-details/user-details.template.html'
})
export class UserDetailsComponent implements OnInit {
    private originalUser: User;
    private user: User;

    constructor(
        private _usersService: UsersService
    ) {} 

    ngOnInit() {
        this._usersService.currentUser().then(u => this.user = this.originalUser = u).catch(e => console.error(e.message));
    }
}