"use strict";
// this import should be first in order to load some required settings (like globals and reflect-metadata)
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var router_1 = require("nativescript-angular/router");
var core_1 = require("@angular/core");
var angular_1 = require('nativescript-telerik-ui/sidedrawer/angular');
var app_component_1 = require("./app.component");
var login_component_1 = require('./login/login.component');
var user_details_component_1 = require('./user-details/user-details.component');
var resolvers_1 = require('./resolvers');
var routes = [
    { path: '', redirectTo: 'login', terminal: true, pathMatch: 'full' },
    // { path: 'event/:eventId', component: EventDetailsComponent },
    { path: 'user-details', component: user_details_component_1.UserDetailsComponent, resolve: {
            user: resolvers_1.UserResolver
        } },
    { path: 'login', component: login_component_1.LoginComponent }
];
var AppComponentModule = (function () {
    function AppComponentModule() {
    }
    AppComponentModule = __decorate([
        core_1.NgModule({
            declarations: [
                angular_1.SIDEDRAWER_DIRECTIVES,
                app_component_1.AppComponent,
                login_component_1.LoginComponent,
                user_details_component_1.UserDetailsComponent
            ],
            bootstrap: [app_component_1.AppComponent],
            imports: [
                forms_1.NativeScriptFormsModule,
                platform_1.NativeScriptModule,
                router_1.NativeScriptRouterModule,
                router_1.NativeScriptRouterModule.forRoot(routes)
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponentModule);
    return AppComponentModule;
}());
platform_1.platformNativeScriptDynamic().bootstrapModule(AppComponentModule);
//# sourceMappingURL=main.js.map