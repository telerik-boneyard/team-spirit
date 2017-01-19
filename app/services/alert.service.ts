import { Injectable, ViewContainerRef, Type } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import * as dialogs from 'ui/dialogs';

@Injectable()
export class AlertService {

    constructor(
        private _modalService: ModalDialogService
    ) {}
    
    showSuccess(message: string) {
        return this._showMessage(message, 'Success', 'Cool');
    }
    
    showError(message: string) {
        return this._showMessage(message, 'Error');
    }

    showInfo(message: string) {
        return this._showMessage(message, 'Just so you know...');
    }

    askConfirmation(message: string) {
        return this._showMessage(message, 'Are you sure?', 'I\'m sure', 'Cancel')
            .then(conf => conf ? Promise.resolve() : Promise.reject(null));
    }

    showModal(ctx: any, ref: ViewContainerRef, componentClass: Type<any>) {
        let opts: ModalDialogOptions = {
            context: ctx,
            fullscreen: true,
            viewContainerRef: ref
        };

        return this._modalService.showModal(componentClass, opts)
            .then(result => (result !== undefined) ? result : Promise.reject(null));
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
