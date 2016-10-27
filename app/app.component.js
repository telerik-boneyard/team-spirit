"use strict";
var core_1 = require("@angular/core");
var services_1 = require('./services');
var router_1 = require('nativescript-angular/router');
var AppComponent = (function () {
    function AppComponent(usersService, routerExtensions) {
        this.usersService = usersService;
        this.routerExtensions = routerExtensions;
        this.loggedIn = this.usersService.loggedIn();
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loggedIn.subscribe(function (logged) {
            if (logged) {
                _this.routerExtensions.navigate(['upcoming-events']);
            }
        });
    };
    AppComponent.prototype.logout = function () {
        this.usersService.logout();
        this.routerExtensions.navigate(['login']);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app.component.html',
            providers: [services_1.EverliveProvider, services_1.UsersService, services_1.EventsService]
        }), 
        __metadata('design:paramtypes', [services_1.UsersService, router_1.RouterExtensions])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map