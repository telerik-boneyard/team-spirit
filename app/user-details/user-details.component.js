"use strict";
var core_1 = require('@angular/core');
var services_1 = require('../services');
var UserDetailsComponent = (function () {
    function UserDetailsComponent(_usersService) {
        this._usersService = _usersService;
    }
    UserDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._usersService.currentUser().then(function (u) { return _this.user = _this.originalUser = u; }).catch(function (e) { return console.error(e.message); });
    };
    UserDetailsComponent = __decorate([
        core_1.Component({
            selector: 'user-details',
            templateUrl: 'user-details/user-details.template.html'
        }), 
        __metadata('design:paramtypes', [services_1.UsersService])
    ], UserDetailsComponent);
    return UserDetailsComponent;
}());
exports.UserDetailsComponent = UserDetailsComponent;
//# sourceMappingURL=user-details.component.js.map