"use strict";
var core_1 = require('@angular/core');
var everlive_provider_service_1 = require('./everlive-provider.service');
var shared_1 = require('../shared');
var Observable_1 = require('rxjs/Observable');
var UsersService = (function () {
    function UsersService(_everliveProvider) {
        this._everliveProvider = _everliveProvider;
        this._users = this._everliveProvider.get.users;
    }
    UsersService.prototype.login = function (username, password) {
        return this._users.login(username, password);
    };
    UsersService.prototype.register = function (username, password) {
        return this._users.register(username, password, null);
    };
    UsersService.prototype.currentUser = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._users.currentUser().then(function (u) {
                return resolve(new shared_1.User(u.result.Username, u.result.DisplayName, u.result.Email, '' //TODO:
                ));
            }).catch(reject);
        });
    };
    UsersService.prototype.loggedIn = function () {
        var _this = this;
        var promise = new Promise(function (resolve) {
            return _this._users.currentUser().then(function (u) { return resolve(!!u); }).catch(function () { return resolve(false); });
        });
        return Observable_1.Observable.fromPromise(promise);
    };
    UsersService.prototype.updateUser = function (user) {
        return this._users.update(user, { Username: user.Username });
    };
    UsersService.prototype.logout = function () {
        return this._users.logout();
    };
    UsersService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [everlive_provider_service_1.EverliveProvider])
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map