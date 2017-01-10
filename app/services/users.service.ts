import { Injectable } from '@angular/core';
import { EverliveProvider } from './everlive-provider.service';
import { Users } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Users';
import { User as ServerUser } from '../../node_modules/everlive-sdk/dist/declarations/everlive/interfaces/User';
import { User } from '../shared'
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UsersService {
    private _users: Users;
    private _isLoggedInSubj: Subject<boolean>;

    constructor(
        private _everliveProvider: EverliveProvider
    ) {
        this._users = this._everliveProvider.get.users;
        this._isLoggedInSubj = new Subject<boolean>();
        this.currentUser().then(u => this._isLoggedInSubj.next(!!u));
    }

    login(username: string, password: string) {
        return this._users.login(username, password)
            .then((resp) => {
                this._isLoggedInSubj.next(true);
                return resp;
            });
    }

    register(username: string, password: string) {
        return this._users.register(username, password, null);
    }

    currentUser() {
        return this._users.currentUser()
            .then(u => {
                return this._serverUserToUserModel(u.result);
            });
    }

    isLoggedIn(): Observable<boolean> {
        return this._isLoggedInSubj;
    }

    updateUser(user: User) {
        return this._users.update(user, { Username: user.Username });
    }

    logout() {
        return this._users.logout().then(r => r, e => e)
            .then((resp) => {
                this._isLoggedInSubj.next(false);
                return resp;
            });
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
