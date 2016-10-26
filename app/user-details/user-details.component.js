"use strict";
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var UserDetailsComponent = (function () {
    function UserDetailsComponent(route) {
        this.route = route;
    }
    UserDetailsComponent.prototype.ngOnInit = function () {
        this.user = this.route.snapshot.data['user'];
    };
    UserDetailsComponent = __decorate([
        core_1.Component({
            selector: 'user-details',
            templateUrl: 'user-details/user-details.template.html'
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute])
    ], UserDetailsComponent);
    return UserDetailsComponent;
}());
exports.UserDetailsComponent = UserDetailsComponent;
//# sourceMappingURL=user-details.component.js.map