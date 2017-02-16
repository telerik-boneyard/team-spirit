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
    GroupsService,
    ImagePickerService,
    FilesService,
    PushNotificationsService,
    PlatformService
} from './services';

let services = [
    EventsService,
    EventRegistrationsService,
    AlertService,
    GroupsService,
    ImagePickerService,
    FilesService,
    PushNotificationsService,
    PlatformService
];

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
    providers: services
})
export class AppComponent implements OnInit {
    disableDrawer: boolean = false;
    isAndroid: boolean = false;
    
    @ViewChild('drawer') drawer: RadSideDrawerComponent;

    constructor(
        private _alertsService: AlertService,
        private _everlive: EverliveProvider,
        private _usersService: UsersService,
        private _routerExtensions: RouterExtensions,
        private _platform: PlatformService
    ) {
        this.isAndroid = this._platform.isAndroid;
    }

    ngOnInit() {
        this._routerExtensions.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                this.disableDrawer = utilities.shouldDisableDrawer(ev.url);
                this.drawer.sideDrawer.gesturesEnabled = !this.disableDrawer;
            }
        });

        if (application.android) {
            application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: application.AndroidActivityBackPressedEventData) => {
                if (this._routerExtensions.canGoBack()) {
                    args.cancel = true;
                    this._routerExtensions.back();
                }
            });
        }
    }

    closeDrawer() {
        this.drawer.sideDrawer.closeDrawer();
    }

    toggleDrawer() {
        this.drawer.sideDrawer.toggleDrawerState();
    }

    logout() {
        this._usersService.logout()
            .then(e => true, e => true)
            .then(() => this._routerExtensions.navigateByUrl('user/login'));
    }
}
