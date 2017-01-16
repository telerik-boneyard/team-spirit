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

    onOk() {
        this.okCallback.emit();
    }

    onCancel() {
        this.cancelCallback.emit();
    }
}
