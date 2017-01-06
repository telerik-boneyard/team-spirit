import { Injectable } from '@angular/core';

import * as dialogs from 'ui/dialogs';

@Injectable()
export class AlertService {
    showSuccess(message: string) {
        return this._showMessage(message, 'Success', 'Cool');
    }
    
    showError(message: string) {
        return this._showMessage(message, 'Error');
    }

    askConfirmation(message: string) {
        return this._showMessage(message, 'Are you sure?', 'I\'m sure', 'Cancel')
            .then(confirmed => {
                return confirmed ? Promise.resolve() : Promise.reject(null);
            });
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
