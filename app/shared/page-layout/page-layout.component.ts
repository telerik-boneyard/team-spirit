import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawerComponent } from 'nativescript-telerik-ui/sidedrawer/angular';
import * as application from 'application';
import * as platform from "platform";
import * as viewModule from 'ui/core/view';

import { Page } from 'ui/page';

import { utilities } from '../';
import {
    UsersService,
    AlertService,
    PlatformService,
    LoadingIndicatorService
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

    private _actionBarNativeObject = null;

    constructor(
        private _loadingService: LoadingIndicatorService,
        private _routerExtensions: RouterExtensions,
        private _alertsService: AlertService,
        private _usersService: UsersService,
        private _platform: PlatformService,
        private _vcRef: ViewContainerRef,
        private _router: Router,
        private _page: Page
    ) {
        this.isAndroid = this._platform.isAndroid;
    }

    ngOnInit() {
        this.disableDrawer = utilities.shouldDisableDrawer(this._router.url);
        if (this._platform.isAndroid && this._platform.sdkVersion >= 21) {
            this.toggleActionBarShadow(this._router.url);
        }
        this.drawer.sideDrawer.gesturesEnabled = !this.disableDrawer;
        
        this._loadingService.extendedLoading.subscribe(() => {
            let modalContext = {
                justLoading: true,
                outsideClose: this._loadingService.allLoaded
            };
            this._alertsService.showModal(modalContext, this._vcRef);
        });
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
        if (!this._actionBarNativeObject) {
            return;
        }
        let path = url.split(';').filter(entry => entry.trim() != '')[0];
        if (path === '/events' || path === '/groups' || path === '/user' || path === '/user/edit') {
            this._actionBarNativeObject.setElevation(0);
        } else {
            this._actionBarNativeObject.setElevation(20);
        }
    }

    actionBarLoaded(args) {
        this._actionBarNativeObject = args.object._nativeView;
        if (this.isAndroid && this._platform.sdkVersion >= 21) {
            this.toggleActionBarShadow(this._router.url);
        }
    }
}
