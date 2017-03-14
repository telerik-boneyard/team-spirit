import * as nsApp from 'application';
import { Page } from 'ui/page';
import { PlatformService } from '../services';

export abstract class AndroidBackOverrider {
    constructor(page: Page, isAndroid: boolean) {
        if (isAndroid) {
            page.on('navigatingTo', () => {
                this._onNavTo();
            });
            page.on('navigatedFrom', () => {
                this._onNavFrom();
            });
        }
    }

    protected abstract onBack();

    private _onNavTo() {
        // if app.android doesn't exist, this should not be called, so we can just use it
        nsApp.android.on(nsApp.AndroidApplication.activityBackPressedEvent, this._onBack, this);
    }

    private _onNavFrom() {
        // if app.android doesn't exist, this should not be called, so we can just use it
        nsApp.android.off(nsApp.AndroidApplication.activityBackPressedEvent, this._onBack, this);
    }

    private _onBack(args) {
        if (this.onBack) {
            this.onBack();
            args.cancel = true;
        }
    }
}
