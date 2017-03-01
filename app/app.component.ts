import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawerComponent } from 'nativescript-telerik-ui/sidedrawer/angular';
import * as application from 'application';
import * as platform from "platform";

import { utilities } from './shared';
import {
    UsersService,
    AlertService,
    PlatformService,
    LoadingIndicatorService
} from './services';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    disableDrawer: boolean = false;
    isAndroid: boolean = false;
    _actionBarNativeObject = null;

    @ViewChild('drawer') drawer: RadSideDrawerComponent;

    constructor(
        private _usersService: UsersService,
        private _routerExtensions: RouterExtensions,
        private _platform: PlatformService,
        private _loadingService: LoadingIndicatorService,
        private _vcRef: ViewContainerRef,
        private _alertsService: AlertService
    ) {
        this.isAndroid = this._platform.isAndroid;
        this._loadingService.extendedLoading.subscribe(() => {
            let modalContext = {
                justLoading: true,
                outsideClose: this._loadingService.allLoaded
            };
            this._alertsService.showModal(modalContext, this._vcRef);
        });
    }

    ngOnInit() {
        this._routerExtensions.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                this.disableDrawer = utilities.shouldDisableDrawer(ev.url);
                this.drawer.sideDrawer.gesturesEnabled = !this.disableDrawer;

                if (application.android && platform.device.sdkVersion >= "21") {
                    this.toggleActionBarShadow(ev);
                }
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

    toggleActionBarShadow(ev) {
        let path = ev.urlAfterRedirects.split(';').filter(entry => entry.trim() != '')[0];
        if (path === '/events' || path === '/groups' || path === '/user' || path === '/user/edit') {
            this._actionBarNativeObject.setElevation(0);
        } else {
            this._actionBarNativeObject.setElevation(20);
        }
    }

    actionBarLoaded(args) {
        this._actionBarNativeObject = args.object._nativeView;
    }
}
