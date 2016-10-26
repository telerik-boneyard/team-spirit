import { Injectable } from '@angular/core'
import { EverliveProvider } from './everlive-provider.service'
import { Users } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Users';

@Injectable()
export class UsersService {
    private _users: Users;

    constructor(
        private _everliveProvider: EverliveProvider
    ) {
        this._users = this._everliveProvider.get.users;
    }

    login(username: string, password: string) {
        return this._users.login(username, password);
    }
}