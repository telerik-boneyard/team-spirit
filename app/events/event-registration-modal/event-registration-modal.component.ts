import { Component } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

import { AlertService } from '../../services';
import { utilities } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'event-registration-modal',
    templateUrl: './event-registration-modal.template.html',
    styleUrls: [ './event-registration-modal.component.css' ]
})
export class EventRegistrationModalComponent {
    availableDates: Array<{ value: Date, isSelected: boolean }>;
    dateFormat = utilities.dateFormat;
    title: string;
    buttons = { ok: 'Submit', cancel: 'Maybe later' };
    private _locked: boolean = false;

    constructor(private _params: ModalDialogParams, private _alertsService: AlertService) {
        this.title = this._params.context.title || 'Vote for date';
        if (this._params.context.buttons) {
            this.buttons.ok = this._params.context.buttons.ok || this.buttons.ok;
            this.buttons.cancel = this._params.context.buttons.cancel || this.buttons.cancel;
        }
        this.availableDates = this._params.context.availableDates.map((dateAsString: string) => {
            return {
                value: new Date(dateAsString),
                isSelected: false
            };
        });
    }

    onOk() {
        if (this._noDateIsSelected()) {
            return this._alertsService.showError('You need to select at least one date');
        }
        let selectedDates = this.availableDates.map((d, i) => d.isSelected ? i : null).filter(n => n !== null);
        this._params.closeCallback(selectedDates);
    }

    onCancel() {
        if (!this._locked) {
            this._params.closeCallback();
        }
    }

    private _noDateIsSelected() {
        return this.availableDates.every(d => !d.isSelected);
    }
}
