import { Component } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
    selector: 'list-picker-modal',
    templateUrl: 'shared/list-picker-modal/list-picker-modal.template.html',
    styleUrls: [ 'shared/list-picker-modal/list-picker-modal.component.css' ]
})
export class ListPickerModalComponent {
    availableOptions: string[] = [];
    selectedIndex: number = 0;

    constructor(private _params: ModalDialogParams) {
        this.availableOptions = this._params.context.items;
        let inputIndex = this._params.context.selectedIndex;

        if (typeof inputIndex === 'number' && inputIndex > -1) {
            this.selectedIndex = inputIndex;
        }
    }

    selectedIndexChanged(selected: number) {
        this.selectedIndex = selected;
    }

    onDone() {
        this._params.closeCallback(this.selectedIndex);
    }
}
