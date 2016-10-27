"use strict";
var core_1 = require('@angular/core');
var router_1 = require('nativescript-angular/router');
var page_1 = require('ui/page');
var services_1 = require('../services');
var LoginComponent = (function () {
    function LoginComponent(_usersService, _routerExtensions, _page) {
        this._usersService = _usersService;
        this._routerExtensions = _routerExtensions;
        this._page = _page;
        this.isSignupView = false;
        this.user = {};
    }
    LoginComponent.prototype.ngOnInit = function () {
        this._page.actionBarHidden = true;
        this._page.backgroundImage = 'res://bg_login';
    };
    LoginComponent.prototype.changeView = function (signupView) {
        this.user.username = '';
        this.user.password = '';
        this.isSignupView = signupView;
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this._usersService.login(this.user.username, this.user.password)
            .then(function () {
            console.log('LOGGED IN');
            _this._routerExtensions.navigate(['upcoming-events']);
        })
            .catch(function (e) {
            console.error(e.message);
        });
    };
    LoginComponent.prototype.signup = function () {
        var _this = this;
        if (this.user.password !== this.user.confirmPassword) {
            return console.error('Both passwords do not match');
        }
        this._usersService.register(this.user.username, this.user.password)
            .then(function (res) {
            _this.changeView(false);
        })
            .catch(function (e) {
            console.error(e.message);
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: 'login/login.template.html',
            styleUrls: ['login/login.component.css']
        }), 
        __metadata('design:paramtypes', [services_1.UsersService, router_1.RouterExtensions, page_1.Page])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map