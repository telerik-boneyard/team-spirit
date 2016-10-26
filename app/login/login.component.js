"use strict";
var core_1 = require('@angular/core');
var services_1 = require('../services');
var LoginComponent = (function () {
    function LoginComponent(_usersService) {
        this._usersService = _usersService;
    }
    LoginComponent.prototype.login = function () {
        this._usersService.login(this.username, this.password)
            .then(function () { return console.log('LOGGED IN'); })
            .catch(function (e) { return console.error(e.message); });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: 'login/login.template.html'
        }), 
        __metadata('design:paramtypes', [services_1.UsersService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map