import { Component } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

import { constants } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'event-creation-modal',
    templateUrl: 'event-creation-modal.template.html',
    styleUrls: [ 'event-creation-modal.component.css' ]
})
export class EventCreationModalComponent {
    groupName: string;
    openForRegistration: boolean = true;

    constructor(private _params: ModalDialogParams) {
        this.groupName = this._params.context.groupName;
        this.openForRegistration = !!this._params.context.openForRegistration;

        setTimeout(() => {
            this._params.closeCallback(true);
        }, constants.modalsTimeout);
    }

    getText() {
        let msg = `Your friends from ${this.groupName} will be notified for this event`;
        if (!this.openForRegistration) {
            msg += ` when you open it for registration`;
        }
        return msg + '.';
    }
}
