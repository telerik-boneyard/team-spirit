import { Component } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { DatePicker } from 'ui/date-picker';
import { TimePicker } from 'ui/time-picker';

import { AlertService } from '../../services';

@Component({
    moduleId: module.id,
    selector: 'datetime-picker-modal',
    templateUrl: './datetime-picker-modal.template.html',
    styleUrls: ['./datetime-picker-modal.component.css']
})
export class DateTimePickerModalComponent {
    date: Date;
    private _isEdit: boolean = false;
    private _valiadtor: (date: Date) => string;

    constructor(private _params: ModalDialogParams, private _alertsService: AlertService) {
        this._isEdit = !!this._params.context.isEdit;
        this._valiadtor = this._params.context.validator;
    }

    onSelect(datePicker: DatePicker, timePicker: TimePicker) {
        let date = datePicker.date;
        date.setHours(timePicker.hour, timePicker.minute, 0, 0);

        let validationErr = this._valiadtor(date);
        if (validationErr) {
            this._alertsService.showError(validationErr);
        } else {
            this._params.closeCallback(date);
        }
    }

    configureDatePicker(picker: DatePicker) {
        let now = new Date();
        let oneYear = 31536000000;

        picker.date = now;
        if (!this._isEdit) {
            picker.minDate = now;
            picker.maxDate = new Date(now.getTime() + (oneYear * 5));
        }
    }
}
