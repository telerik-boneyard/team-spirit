import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawerComponent } from 'nativescript-telerik-ui/sidedrawer/angular';
import * as application from 'application';
import * as platform from "platform";
import * as viewModule from 'ui/core/view';

import { Page } from 'ui/page';

import { utilities, User } from '../';
import {
    UsersService,
    AlertService,
    PlatformService
} from '../../services';

@Component({
    moduleId: module.id,
    selector: 'page-layout',
    templateUrl: './page-layout.template.html',
    styleUrls: [ './page-layout.component.css' ]
})
export class PageLayoutComponent implements OnInit {
    @ViewChild('drawer') drawer: RadSideDrawerComponent;

    disableDrawer: boolean = false;
    isAndroid: boolean = false;
    user: User;

    private _actionBarNativeObject = null;
    private _isSettingsScrn = /^\/settings.*/i
    private _isBackNav: boolean = false;

    constructor(
        private _routerExtensions: RouterExtensions,
        private _alertsService: AlertService,
        private _usersService: UsersService,
        private _platform: PlatformService,
        private _vcRef: ViewContainerRef,
        private _router: Router,
        private _page: Page
    ) {
        this.isAndroid = this._platform.isAndroid;
        this._page.on('navigatingTo', (args) => {
            this._isBackNav = args.isBackNavigation;
            if (this._actionBarNativeObject) {
                this.toggleActionBarShadow(this._router.url);
            }
        });
    }

    ngOnInit() {
        // hack to make drawer respond to actions - otherwise,
        // sometimes it cannot be opened before tapping the button
        this.drawer.sideDrawer.closeDrawer();

        if (this._actionBarNativeObject) {
            this.toggleActionBarShadow(this._router.url);
        }

        this._usersService.currentUser()
            .then(user => this.user = user)
            .catch(err => err && this._alertsService.showError(err.message));
    }

    navigate(newRoute: string) {
        let transition = utilities.getMenuTransition();
        this._routerExtensions.navigate([newRoute], {
            clearHistory: true,
            transition
        });
    }

    toggleDrawer() {
        this.drawer.sideDrawer.toggleDrawerState();
    }

    logout() {
        this._usersService.logout()
            .then(e => true, e => true)
            .then(() => this.navigate('user/login'));
    }

    toggleActionBarShadow(url: string) {
        if (this._isSettingsScrn.test(url) && !this._isBackNav) {
            this._actionBarNativeObject.setElevation(20);
        } else {
            this._actionBarNativeObject.setElevation(0);
        }
    }

    actionBarLoaded(args) {
        if (this.isAndroid && this._platform.sdkVersion >= 21) {
            this._actionBarNativeObject = args.object._nativeView;
            this.toggleActionBarShadow(this._router.url);
        }
    }

    isActive(urlRoot: string) {
        return this._router.url.indexOf('/' + urlRoot) === 0;
    }
}
