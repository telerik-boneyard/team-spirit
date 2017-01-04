import { Injectable } from '@angular/core';
import { EverliveProvider } from './everlive-provider.service';
import { Users } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Users';
import { User as ServerUser } from '../../node_modules/everlive-sdk/dist/declarations/everlive/interfaces/User';
import { User } from '../shared'
import { Observable } from 'rxjs';

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

    register(username: string, password: string) {
        return this._users.register(username, password, null);
    }

    currentUser() {
        return new Promise<User>((resolve, reject) => {
            this._users.currentUser().then(u => {
                return resolve(this._serverUserToUserModel(u.result));
            }).catch(reject);
        });
    }

    loggedIn(): Observable<boolean> {
        const promise = new Promise<boolean>(resolve => {
            return this._users.currentUser().then(u => resolve(!!u)).catch(() => resolve(false));
        });

        return Observable.fromPromise(promise);
    }

    updateUser(user: User) {
        return this._users.update(user, { Username: user.Username });
    }

    logout() {
        return this._users.logout().then(r => r, e => e);
    }

    getById(id: string, expandExp?: any): Promise<User> {
        if (expandExp) {
            this._users.expand(expandExp);
        }
        
        return this._users.getById(id).then(res => {
            return this._serverUserToUserModel(res.result);
        });
    }

    private _serverUserToUserModel(user: any) { // cause expand could have anything
        if (!user) {
            return null;
        }
        return new User(user.Id, user.Username, user.DisplayName, user.Email, user.ImageUrl);
    }
}
