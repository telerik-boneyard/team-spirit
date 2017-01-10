import { Injectable } from '@angular/core';
import { EverliveProvider } from './everlive-provider.service';
import { Users } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Users';
import { User as ServerUser } from '../../node_modules/everlive-sdk/dist/declarations/everlive/interfaces/User';
import { User } from '../shared'
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class UsersService {
    private _users: Users;
    private _isLoggedInSubj: BehaviorSubject<boolean>;
    private _imageExpandExp = {
        Image: {
            SingleField: 'Uri',
            ReturnAs: 'ImageUrl'
        }
    };
    private _currUserPrm: Promise<User>;

    constructor(
        private _everliveProvider: EverliveProvider
    ) {
        this._users = this._everliveProvider.get.users;
        this._isLoggedInSubj = new BehaviorSubject<boolean>(false);
        this.currentUser().then(u => this._isLoggedInSubj.next(!!u));
    }

    login(username: string, password: string) {
        return this._users.login(username, password)
            .then((resp) => {
                this._isLoggedInSubj.next(true);
                this._currUserPrm = null;
                return resp;
            });
    }

    register(username: string, password: string) {
        return this._users.register(username, password, null);
    }

    currentUser(reCache = false) {
        if (!this._currUserPrm || reCache) {
            console.log('making request for curr user');
            this._currUserPrm = this._users.expand(this._imageExpandExp)
                .currentUser()
                .then(u => this._serverUserToUserModel(u.result));
        }
        return this._currUserPrm;
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
                this._currUserPrm = null;
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
        return new User(user.Id, user.Username, user.DisplayName, user.Email, user.ImageUrl, user.Phone);
    }
}
