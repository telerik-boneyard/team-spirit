import { Component, Input, OnInit, ViewContainerRef, Type } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { EventsService, AlertService, UsersService, GroupsService } from '../../services';
import { ListPickerModalComponent, DateTimePickerModalComponent } from '../../shared';
import { Event, Group, User } from '../../shared';
import { utilities } from '../../shared';

@Component({
    selector: 'editable-event',
    templateUrl: 'events/editable-event/editable-event.template.html',
    styleUrls: [ 'events/editable-event/editable-event.component.css' ]
})
export class EditableEventComponent implements OnInit{
    @Input() event: Event;

    dateFormat: string = utilities.dateFormat;
    dateOptions: Date[] = [];
    userGroups: Group[];
    currentUser: User;
    selectedGroup: Group;
    
    private _isEdit: boolean = false;

    constructor(
        private _modalService: ModalDialogService,
        private _groupsService: GroupsService,
        private _eventService: EventsService,
        private _usersService: UsersService,
        private _alertService: AlertService,
        private _vcRef: ViewContainerRef
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
    }

    getSelectDateText() {
        return this.dateOptions.length ? 'Add date option' : 'Select date';
    }

    getResizedImageUrl(rawUrl: string) {
        return utilities.getAsResizeUrl(rawUrl, { width: 120, height: 120 });
    }

    toggleOpenForRegistration() {
        this.event.OpenForRegistration = !this.event.OpenForRegistration;
    }

    onAddDateOption(date: Date) {
        let clone = new Date(date.getTime());
        this._addDateOptionToEvent(clone);
    }

    removeDateOption(optIndex: number) {
        this.dateOptions.splice(optIndex, 1);
        this._applyDateOptionsToEvent();
    }

    onSelectGroup() {
        this._openGroupModal()
            .then((selectedIndex: number) => {
                this.selectGroup(this.userGroups[selectedIndex]);
            }, err => err); // ignore rejection (when user clicks back and closes)
    }

    onSelectDate() {
        this._openDateModal()
            .then((newDateOption: Date) => {
                this.onAddDateOption(newDateOption);
            }, err => err); // ignore rejection (when user clicks back and closes)
    }

    selectGroup(group: Group) {
        this.event.GroupId = group.Id;
        this.selectedGroup = group;
    }

    getSelectedGroupName() {
        let name = this.selectedGroup && this.selectedGroup.Name;
        return name ? name : '';
    }

    private _validateDateOption(date: Date) {
        if (this._isDuplicateDate(date)) {
            return 'Date already added';
        } else if (!this._isEdit && date <= new Date()) {
            return 'Date is in the past';
        }
    }

    private _openModal(ctx: any, componentClass: Type<any>) {
        let opts: ModalDialogOptions = {
            context: ctx,
            fullscreen: true,
            viewContainerRef: this._vcRef
        };

        return this._modalService.showModal(componentClass, opts)
            .then(result => (result !== undefined) ? result : Promise.reject(null));
    }

    private _openGroupModal() {
        let selectedIndex = utilities.findIndex(this.userGroups, g => g.Id === this.event.GroupId);
        let ctx = {
            items: this.userGroups.map(g => g.Name),
            selectedIndex 
        };
        return this._openModal(ctx, ListPickerModalComponent);
    }

    private _openDateModal() {
        let ctx = {
            isEdit: this._isEdit,
            validator: this._validateDateOption.bind(this)
        };
        return this._openModal(ctx, DateTimePickerModalComponent);
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
            this.event.EventDateChoices = null;
        } else {
            this.event.EventDateChoices = this.dateOptions.map(d => d.toISOString());
            this.event.EventDate = null;
        }
    }

    private _showError(msg: string) {
        this._alertService.showError(msg);
    }

    private _getCurrentUserGroups() {
        return this._usersService.currentUser()
            .then(user => {
                this.currentUser = user;
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
        let evGroup = utilities.find(this.userGroups, g => g.Id === event.GroupId);
        if (evGroup) {
            this.selectGroup(evGroup);
        }
    }
}
