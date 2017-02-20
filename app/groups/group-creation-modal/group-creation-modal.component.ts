import { Component } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
    moduleId: module.id,
    selector: 'group-creation-modal',
    templateUrl: './group-creation-modal.template.html',
    styleUrls: ['./group-creation-modal.component.css']
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
