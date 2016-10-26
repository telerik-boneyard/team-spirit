"use strict";
var Observable_1 = require('rxjs/Observable');
var UserResolver = (function () {
    function UserResolver(_usersService) {
        this._usersService = _usersService;
    }
    UserResolver.prototype.resolve = function (route, state) {
        return Observable_1.Observable.fromPromise(this._usersService.currentUser());
    };
    return UserResolver;
}());
exports.UserResolver = UserResolver;
//# sourceMappingURL=current-user.resolver.js.map