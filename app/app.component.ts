import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawerComponent } from 'nativescript-telerik-ui/sidedrawer/angular';
import * as application from 'application';

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
    private loggedIn: boolean = false;
    @ViewChild('drawer') drawer: RadSideDrawerComponent;

    constructor(
        private usersService: UsersService,
        private routerExtensions: RouterExtensions
    ) { }

    ngOnInit() {
        this.usersService.loggedIn().subscribe(logged => {
            if (logged) {
                this.routerExtensions.navigate(['events']);
            }

            this.loggedIn = logged;
        });

        application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: application.AndroidActivityBackPressedEventData) => {
            if (this.routerExtensions.canGoBack()) {
                args.cancel = true;
                this.routerExtensions.back();
            }
        });
    }

    closeDrawer() {
        this.drawer.sideDrawer.closeDrawer();
    }

    openDrawer() {
        this.drawer.sideDrawer.showDrawer();
    }

    toggleDrawer() {
        if (this.drawer.sideDrawer.getIsOpen()) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }

    logout() {
        this.usersService.logout();
        this.loggedIn = false;
        //TODO: Stop drawer from showing and close it
        this.routerExtensions.navigate(['login']);
    }
}
