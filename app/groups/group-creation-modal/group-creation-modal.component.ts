import { Component } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
    selector: 'group-creation-modal',
    templateUrl: 'groups/group-creation-modal/group-creation-modal.template.html',
    styleUrls: [ 'groups/group-creation-modal/group-creation-modal.component.css' ]
})
export class GroupCreationModalComponent {
    groupName: string;

    constructor(private _params: ModalDialogParams) {
        this.groupName = this._params.context.groupName;
    }

    getText() {
        return `You have successfully created ${this.groupName}.`;
    }

    onOk() {
        this._params.closeCallback(true);
    }

    onCancel() {
        this._params.closeCallback(false);
    }
}
