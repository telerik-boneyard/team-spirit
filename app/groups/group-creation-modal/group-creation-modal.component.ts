import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { constants } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'group-creation-modal',
    templateUrl: './group-creation-modal.template.html',
    styleUrls: ['./group-creation-modal.component.css']
})
export class GroupCreationModalComponent implements OnInit {
    groupName: string;

    constructor(private _params: ModalDialogParams) {
        this.groupName = this._params.context.groupName;
    }

    ngOnInit() {
        setTimeout(() => {
            this.onCancel();
        }, constants.modalsTimeout);
    }

    getText() {
        let text = `You have successfully created "${this.groupName}"`;
        if (this.groupName.indexOf('group') === -1) {
            text += ' group';
        }
        return text + '.';
    }

    onOk() {
        this._params.closeCallback(true);
    }

    onCancel() {
        this._params.closeCallback(false);
    }
}
