import { Injectable } from '@angular/core';

import * as dialogs from 'ui/dialogs';

@Injectable()
export class AlertService {
    showError(message: string) {
        return this._showMessage(message, 'Error');
    }

    private _showMessage (message: string, title: string, okButtonText: string = 'Ok', cancelButtonText?: string): Promise<any> {
        let alertData: any = {};

        return dialogs.confirm({
            title,
            message,
            okButtonText,
            cancelButtonText
        });
    }
}
