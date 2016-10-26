"use strict";
var core_1 = require('@angular/core');
var everlive_provider_service_1 = require('./everlive-provider.service');
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
    UsersService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [everlive_provider_service_1.EverliveProvider])
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map