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

    showInfo(message: string) {
        return this._showMessage(message, 'You could try...');
    }

    askConfirmation(message: string) {
        return this._showMessage(message, 'Are you sure?', 'I\'m sure', 'Cancel')
            .then(conf => conf ? Promise.resolve() : Promise.reject(null));
    }

    private _showMessage (message: string, title: string, okButtonText: string = 'Ok', cancelButtonText?: string): Promise<any> {
        return dialogs.confirm({
            title,
            message,
            okButtonText,
            cancelButtonText
        });
    }
}
