import { Component, Input, OnInit } from '@angular/core';
import { DatePicker } from "ui/date-picker";
import { TimePicker } from "ui/time-picker";
// import { ActivatedRoute } from '@angular/router';
// import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
// import * as utils from 'utils/utils';

import { EventsService, AlertService, UsersService, GroupsService } from '../../services';
import { Event, Group } from '../../shared/models';
import { utilities } from '../../shared';
// import { EventRegistrationModalComponent } from '../event-registration-modal/event-registration-modal.component';

@Component({
    selector: 'editable-event',
    templateUrl: 'events/editable-event/editable-event.template.html',
    styleUrls: [ 'events/editable-event/editable-event.component.css' ]
})
export class EditableEventComponent implements OnInit{
    @Input() event: Event;

    dateFormat: string = utilities.dateFormat;
    singleDate: boolean = true;
    newEventDate: Date;
    dateOptions: Date[] = [];
    userGroups: Group[];

    constructor(
        private _eventService: EventsService,
        private _groupsService: GroupsService,
        private _usersService: UsersService,
        private _alertService: AlertService
    ) { }

    ngOnInit() {
        this.event.OpenForRegistration = true;
        this._getCurrentUserGroups().then(groups => {
            this.userGroups = groups;
        });
    }

    toggleOpenForRegistration() {
        this.event.OpenForRegistration = !this.event.OpenForRegistration;
    }

    configureDatePicker(picker: DatePicker) {
        let now = new Date();
        let oneYear = 31536000000;

        picker.date = now;
        picker.minDate = now;
        picker.maxDate = new Date(now.getTime() + (oneYear * 5));
    }

    onAddDateOption(datePicker: DatePicker, timePicker: TimePicker): void {
        let date = datePicker.date;
        date.setHours(timePicker.hour, timePicker.minute, 0, 0);
        if (this._isDuplicateDate(date)) {
            return this._showError('Date already added');
        } else if (date <= new Date()) {
            return this._showError('Date is in the past');
        }
        this._addDateOptionToEvent(date);
    }

    removeDateOption(optIndex: number) {
        this.dateOptions.splice(optIndex, 1);
    }

    selectGroup(group: Group) {
        this.event.GroupId = group.Id;
        this.userGroups.forEach((g: any) => g._selected = g.Id === group.Id);
    }

    private _isDuplicateDate(date: Date) {
        let dateStr = date.toISOString();
        let dateNotPresent = this.dateOptions.every(d => dateStr !== d.toISOString());
        return !dateNotPresent;
    }

    private _addDateOptionToEvent(date: Date) {
        let clone = new Date(date.getTime());
        this.dateOptions.push(clone);

        if (this.dateOptions.length === 1) {
            this.event.EventDate = clone.toISOString();
            this.event.EventDateChoices = undefined;
        } else {
            this.event.EventDateChoices = this.dateOptions.map(d => d.toISOString());
            this.event.EventDate = undefined;
        }
    }

    private _showError(msg: string) {
        this._alertService.showError(msg);
    }

    private _getCurrentUserGroups() {
        return this._usersService.currentUser()
            .then(user => {
                return this._groupsService.getGroupsByUserId(user.Id);
            });
    }
}
