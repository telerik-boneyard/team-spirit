import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatePicker } from "ui/date-picker";
import { TimePicker } from "ui/time-picker";

import { EventsService, AlertService, UsersService, GroupsService } from '../../services';
import { Event, Group } from '../../shared/models';
import { utilities } from '../../shared';

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
    
    private _isEdit: boolean = false;
    @ViewChild('datePicker') private _datePicker: DatePicker;

    constructor(
        private _eventService: EventsService,
        private _groupsService: GroupsService,
        private _usersService: UsersService,
        private _alertService: AlertService
    ) { }

    ngOnInit() {
        if (typeof this.event.OpenForRegistration !== 'boolean') {
            this.event.OpenForRegistration = true;
        }
        this._getCurrentUserGroups().then(groups => {
            this.userGroups = groups;
            this._markSelectedGroupIfPresent(this.event, this.userGroups);
        });
        this._handleEventDatesIfPresent(this.event);
        this._isEdit = this.event.Id !== undefined;
        this._configureDatePicker(this._datePicker);
    }

    toggleOpenForRegistration() {
        this.event.OpenForRegistration = !this.event.OpenForRegistration;
    }

    onAddDateOption(datePicker: DatePicker, timePicker: TimePicker): void {
        let date = datePicker.date;
        date.setHours(timePicker.hour, timePicker.minute, 0, 0);
        if (this._isDuplicateDate(date)) {
            return this._showError('Date already added');
        } else if (!this._isEdit && date <= new Date()) {
            return this._showError('Date is in the past');
        }
        
        let clone = new Date(date.getTime());
        this._addDateOptionToEvent(clone);
    }

    removeDateOption(optIndex: number) {
        this.dateOptions.splice(optIndex, 1);
        this._applyDateOptionsToEvent();
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
        this.dateOptions.push(date);
        this._applyDateOptionsToEvent();
    }

    private _applyDateOptionsToEvent() {
        if (this.dateOptions.length === 1) {
            let clone = new Date(this.dateOptions[0]);
            this.event.EventDate = clone.toISOString();
            this.event.EventDateChoices = undefined;
        } else {
            this.event.EventDateChoices = this.dateOptions.map(d => d.toISOString());
            this.event.EventDate = undefined;
        }
    }

    private _configureDatePicker(picker: DatePicker) {
        let now = new Date();
        let oneYear = 31536000000;

        picker.date = now;
        if (!this._isEdit) {
            picker.minDate = now;
            picker.maxDate = new Date(now.getTime() + (oneYear * 5));
        }
    }

    private _showError(msg: string) {
        this._alertService.showError(msg);
    }

    private _getCurrentUserGroups() {
        return this._usersService.currentUser()
            .then(user => {
                return this._groupsService.getUserGroups(user.Id);
            });
    }

    private _handleEventDatesIfPresent(event: Event) {
        if (event.EventDate) {
            this.dateOptions = [new Date(event.EventDate)];
        } else if (event.EventDateChoices) {
            this.dateOptions = event.EventDateChoices.map(d => new Date(d));
        }
    }

    private _markSelectedGroupIfPresent(event: Event, userGroups: Group[]) {
        let evGroup = userGroups.filter(g => g.Id === event.GroupId)[0];
        if (evGroup) {
            this.selectGroup(evGroup);
        }
    }
}
