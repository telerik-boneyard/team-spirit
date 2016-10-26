import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from '../shared';
import { UsersService } from '../services';

export class UserResolver implements Resolve<User> {
    constructor(
        private _usersService: UsersService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
        return Observable.fromPromise(this._usersService.currentUser());
    }
}