import { Component } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

import { utilities } from '../../shared';

@Component({
    selector: 'event-registration-modal',
    templateUrl: 'events/event-registration-modal/event-registration-modal.template.html',
    styleUrls: [ 'events/event-registration-modal/event-registration-modal.component.css' ]
})
export class EventRegistrationModalComponent {
    availableDates: Array<{ value: Date, isSelected: boolean }>;
    dateFormat = utilities.dateFormat;

    constructor(private params: ModalDialogParams) {
        this.availableDates = this.params.context.availableDates.map((dateAsString: string) => {
            return {
                value: new Date(dateAsString),
                isSelected: false
            };
        });
        console.log('date choices: ' + JSON.stringify(this.availableDates));
    }
    
    closeModal(isCancelling) {
        if (isCancelling) {
            this.params.closeCallback();
            return;
        } else if (this.noDateIsSelected()) {
            return;
        }

        let selectedDates = this.availableDates.map((d, i) => d.isSelected ? i : null).filter(n => n !== null);
        this.params.closeCallback(selectedDates);
    }
    
    noDateIsSelected() {
        return this.availableDates.every(d => !d.isSelected);
    }
}
