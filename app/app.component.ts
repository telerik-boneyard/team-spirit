import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawerComponent } from 'nativescript-telerik-ui/sidedrawer/angular';
import * as application from 'application';

import { utilities } from './shared';
import {
    EverliveProvider,
    UsersService,
    EventsService,
    EventRegistrationsService,
    AlertService,
    GroupsService
} from './services';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
    providers: [EverliveProvider, UsersService, EventsService, EventRegistrationsService, AlertService, GroupsService]
})
export class AppComponent implements OnInit {
    loggedIn: boolean = false;
    disableDrawer: boolean = false;
    
    @ViewChild('drawer') drawer: RadSideDrawerComponent;

    constructor(
        private _usersService: UsersService,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit() {
        this._usersService.isLoggedIn().subscribe(isLoggedIn => {
            this.loggedIn = isLoggedIn;

            if (this.loggedIn) {
                this._routerExtensions.navigate(["/events"], { clearHistory: true });
            } else {
                this._routerExtensions.navigate(['user/login']);
            }
        });

        this._routerExtensions.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                this.disableDrawer = utilities.shouldDisableDrawer(ev.url);
                this.drawer.sideDrawer.gesturesEnabled = !this.disableDrawer;
            }
        });

        application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: application.AndroidActivityBackPressedEventData) => {
            if (this._routerExtensions.canGoBack()) {
                args.cancel = true;
                this._routerExtensions.back();
            }
        });
    }

    closeDrawer() {
        this.drawer.sideDrawer.closeDrawer();
    }

    toggleDrawer() {
        this.drawer.sideDrawer.toggleDrawerState();
    }

    logout() {
        this._usersService.logout();
    }
}
