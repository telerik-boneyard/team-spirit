import { Component } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

import { AlertService } from '../../services';
import { utilities } from '../../shared';

@Component({
    selector: 'password-reset-modal',
    templateUrl: 'users/password-reset-modal/password-reset-modal.template.html',
    styleUrls: [ 'users/password-reset-modal/password-reset-modal.component.css' ]
})
export class PasswordResetModalComponent {
    title: string = 'Forgot your password?';
    text: string = 'Enter your email to request a password reset.';
    email: string;
    buttons = { ok: 'Reset my password', cancel: 'Cancel' };

    constructor(
        private _params: ModalDialogParams,
        private _alertsService: AlertService
    ) {}
    
    onOk() {
        if (!utilities.isEmail(this.email)) {
            return this._alertsService.showError('Please enter a valid email address');
        }
        this._params.closeCallback(this.email);
    }

    onCancel() {
        this._params.closeCallback();
    }
}
