import { Component } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
    selector: 'event-creation-modal',
    templateUrl: 'events/event-creation-modal/event-creation-modal.template.html',
    styleUrls: [ 'events/event-creation-modal/event-creation-modal.component.css' ]
})
export class EventCreationModalComponent {
    groupName: string;

    constructor(private _params: ModalDialogParams) {
        this.groupName = this._params.context.groupName;

        setTimeout(() => {
            this._params.closeCallback(true);
        }, 3000);
    }

    getText() {
        return `Your friends from ${this.groupName} will be notified for this event.`;
    }
}
