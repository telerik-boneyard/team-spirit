import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';
import { utilities } from './shared';
import { FilesService } from './services';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    loading: boolean = true;

    constructor(
        private _page: Page,
        private _filesService: FilesService,
        private _routerExtensions: RouterExtensions
    ) {}

    ngOnInit() {
        this._page.actionBarHidden = true;
        // TODO: removing this breaks the module. will look into it later
        utilities.isNonemptyString('qweqwewee');
        this._routerExtensions.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                this.loading = false;
            }
        });
        this._filesService.emptyAppTempFolder();
            // .catch(err => console.log('err while emptying: ' + JSON.stringify(err)));
    }
}
