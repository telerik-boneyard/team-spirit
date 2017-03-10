import { Component, Input, OnInit } from '@angular/core';
import { Page } from 'ui/page';
import { View } from 'ui/core/view';

import { LoadingIndicatorService } from '../../services';

@Component({
    moduleId: module.id,
    selector: 'loading-screen',
    templateUrl: './loading-screen.template.html',
    styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit {
    @Input('hideElement') hideElementId: string;
    showLoader: boolean = false;
    private _hideElement: View;
    private _extendedLoadingSub: any;
    private _allLoaded: any;
    private _defaultActionBarHidden: boolean = false;
    
    constructor(
        private _loadingService: LoadingIndicatorService,
        private _page: Page
    ) {
        this._defaultActionBarHidden = this._page.actionBarHidden;
    }

    ngOnInit() {
        this._hideElement = this._page.getViewById(this.hideElementId);
        this._subscribeToLoadingEvents();

        this._page.on('navigatingTo', data => {
            this._subscribeToLoadingEvents();
        });
        this._page.on('navigatingFrom', data => {
            this._unsubscriebFromLoadingEvents();
        });
    }

    private _subscribeToLoadingEvents() {
        this._extendedLoadingSub = this._loadingService.extendedLoading.subscribe(() => {
            this._startLoading();
        });
        this._allLoaded = this._loadingService.allLoaded.subscribe(() => {
            this._endLoading();
        });
    }

    private _unsubscriebFromLoadingEvents() {
        this._extendedLoadingSub.unsubscribe();
        this._allLoaded.unsubscribe();
    }

    private _startLoading() {
        // console.log('LOADING start');
        this._hideElement.visibility = 'collapse';
        this.showLoader = true;
        this._page.actionBarHidden = true;
    }

    private _endLoading() {
        // console.log('LOADING end');
        this._hideElement.visibility = 'visible';
        this.showLoader = false;
        this._page.actionBarHidden = this._defaultActionBarHidden;
    }
}
