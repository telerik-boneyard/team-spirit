import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
    selector: 'app-modal',
    templateUrl: 'shared/app-modal/app-modal.template.html',
    styleUrls: [ 'shared/app-modal/app-modal.component.css' ]
})
export class AppModalComponent {
    @Output('ok') okCallback = new EventEmitter<any>();
    @Output('cancel') cancelCallback = new EventEmitter<any>();
    @Input() buttons: { ok?: string, cancel?: string };
    @Input() title: string;
    @Input() text: string;

    constructor(private _params?: ModalDialogParams) {
        if (!this._params) {
            return;
        }

        if (this._params.context.buttons) {
            this.buttons = this._params.context.buttons;
        }

        if (this._params.context.closeTimeout) {
            setTimeout(() => {
                this._params.closeCallback(true);
            }, this._params.context.closeTimeout);
        }

        this.title = this._params.context.title;
        this.text = this._params.context.text;
    }

    onOk() {
        this.okCallback.emit();
    }

    onCancel() {
        this.cancelCallback.emit();
    }
}
