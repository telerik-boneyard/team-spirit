import { Component } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

import { AlertService } from '../../services';
import { utilities } from '../../shared';

@Component({
    selector: 'event-registration-modal',
    templateUrl: 'events/event-registration-modal/event-registration-modal.template.html',
    styleUrls: [ 'events/event-registration-modal/event-registration-modal.component.css' ]
})
export class EventRegistrationModalComponent {
    availableDates: Array<{ value: Date, isSelected: boolean }>;
    dateFormat = utilities.dateFormat;

    constructor(private _params: ModalDialogParams, private _alertsService: AlertService) {
        this.availableDates = this._params.context.availableDates.map((dateAsString: string) => {
            return {
                value: new Date(dateAsString),
                isSelected: false
            };
        });
    }
    
    onOk() {
        if (this._noDateIsSelected()) {
            return this._alertsService.showInfo('Selecting at least one date');
        }
        
        let selectedDates = this.availableDates.map((d, i) => d.isSelected ? i : null).filter(n => n !== null);
        this._params.closeCallback(selectedDates);
    }

    onCancel() {
        this._params.closeCallback();
    }
    
    private _noDateIsSelected() {
        return this.availableDates.every(d => !d.isSelected);
    }
}
