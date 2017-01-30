import { Injectable } from '@angular/core';
import { EverliveProvider } from './everlive-provider.service';
import { Users } from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Users';
import { User as ServerUser } from '../../node_modules/everlive-sdk/dist/declarations/everlive/interfaces/User';
import { User } from '../shared'
import { Observable, BehaviorSubject } from 'rxjs';

import { utilities } from '../shared';

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
    private _currUserCache: Promise<User>;

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
                this._currUserCache = null;
                return resp;
            });
    }

    register(username: string, password: string) {
        return this._users.register(username, password, { Email: username });
    }

    resetUserPassword(identifier: string) {
        let obj: any = {};
        
        if (utilities.isEmail(identifier)) {
            obj.Email = identifier;
        } else {
            obj.Username = identifier;
        }
        
        return this._users.resetPassword(obj).then(res => true, err => true);
    }

    currentUser(reCache = false) {
        if (!this._currUserCache || reCache) {
            this._currUserCache = this._users.expand(this._imageExpandExp)
                .currentUser()
                .then(u => this._serverUserToUserModel(u.result));
        }
        return this._currUserCache;
    }

    isLoggedIn(): Observable<boolean> {
        return this._isLoggedInSubj;
    }

    updateUser(user: User) {
        delete user.ImageUrl; // delete expanded field, if present
        let updatePromise = this._users.updateSingle(user);
        // dont chain so returned promise doesnt have the cache clearing
        updatePromise.then(() => this._currUserCache = null);
        return updatePromise;
    }

    logout() {
        return this._users.logout().then(r => r, e => e)
            .then((resp) => {
                this._isLoggedInSubj.next(false);
                this._currUserCache = null;
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

    validateUser(user: any) {
        let errMsg = '';

        if (!utilities.isEmail(user.username)) {
            errMsg = 'Email is not valid';
        }
        
        return errMsg;
    }

    private _serverUserToUserModel(user: any) { // cause expand could have anything
        if (!user) {
            return null;
        }
        return new User(user.Id, user.Username, user.DisplayName, user.Email, user.ImageUrl, user.Phone, user.Image, user.PushNotificationsEnabled, user.EmailNotificationsEnabled);
    }
}
