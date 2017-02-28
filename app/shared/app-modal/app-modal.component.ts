import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
    moduleId: module.id,
    selector: 'app-modal',
    templateUrl: './app-modal.template.html',
    styleUrls: [ './app-modal.component.css' ]
})
export class AppModalComponent {
    @Output('ok') okCallback = new EventEmitter<any>();
    @Output('cancel') cancelCallback = new EventEmitter<any>();
    @Input() buttons: { ok?: string, cancel?: string };
    @Input() title: string;
    @Input() text: string;
    @Input() fullscreen: boolean = true;

    outsideClose: EventEmitter<void>;

    constructor(private _params?: ModalDialogParams) {
        if (!this._params) {
            return;
        }
        this._applyContextOptions(this._params.context);
    }

    onOk() {
        if (this.okCallback.observers.length > 0) {
            this.okCallback.emit();
        } else {
            this._params.closeCallback();
        }
    }

    onCancel() {
        if (this.cancelCallback.observers.length > 0) {
            this.cancelCallback.emit();
        } else {
            this._params.closeCallback();
        }
    }

    private _applyContextOptions(ctx: any) {
        let validProps = ['title', 'text', 'buttons', 'fullscreen', 'justLoading', 'outsideClose'];
        for (let prop of validProps) {
            if (prop in ctx && prop) {
                this[prop] = ctx[prop];
            }
        }

        if (ctx.outsideClose) {
            this.outsideClose.subscribe(() => this._params.closeCallback(true));
        }

        if (ctx.closeTimeout) {
            setTimeout(() => {
                this._params.closeCallback(true);
            }, ctx.closeTimeout);
        }
    }
}
