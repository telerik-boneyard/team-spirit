import { Component, Input, OnInit, ViewContainerRef, Type } from '@angular/core';

import { EventsService, AlertService, UsersService, GroupsService } from '../../services';
import { ListPickerModalComponent, DateTimePickerModalComponent } from '../../shared';
import { Event, Group, User } from '../../shared';
import { utilities } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'editable-event',
    templateUrl: './editable-event.template.html',
    styleUrls: [ './editable-event.component.css' ]
})
export class EditableEventComponent implements OnInit {
    @Input() event: Event;
    @Input() userGroups: Group[];

    dateFormat: string = utilities.dateFormat;
    dateOptions: Date[] = [];
    currentUser: User;
    selectedGroup: Group;

    isEdit: boolean = false;

    constructor(
        private _groupsService: GroupsService,
        private _eventService: EventsService,
        private _usersService: UsersService,
        private _alertService: AlertService,
        private _vcRef: ViewContainerRef
    ) {}

    ngOnInit() {
        if (typeof this.event.OpenForRegistration !== 'boolean') {
            this.event.OpenForRegistration = true;
        }
        this.isEdit = this.event.Id !== undefined; // must be before prefilling group
        if (this.userGroups.length === 1) {
            this.event.GroupId = this.userGroups[0].Id;
        }
        this._markSelectedGroupIfPresent(this.event, this.userGroups);
        this._handleEventDatesIfPresent(this.event);
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
        if (this.isEdit) {
            return;
        }
        
        this._openGroupModal()
            .then((selectedIndex: number) => {
                if (selectedIndex > -1) {
                    this.selectGroup(this.userGroups[selectedIndex]);
                }
            }, err => err); // ignore rejection (when user clicks back and closes)
    }

    onSelectDate() {
        if (this.event.RegistrationCompleted) {
            return;
        }
        
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
        } else if (date <= new Date()) {
            return 'Date is in the past';
        }
    }

    private _openModal(ctx: any, componentClass: Type<any>) {
        return this._alertService.showModal(ctx, this._vcRef, componentClass);
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
            isEdit: this.isEdit,
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
        this.dateOptions = this.dateOptions.sort(utilities.compareForSort);
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

    private _handleEventDatesIfPresent(event: Event) {
        if (event.EventDate) {
            this.dateOptions = [new Date(event.EventDate)];
        } else if (event.EventDateChoices) {
            this.dateOptions = event.EventDateChoices.map(d => new Date(d)).sort(utilities.compareForSort);
        }
    }

    private _markSelectedGroupIfPresent(event: Event, userGroups: Group[]) {
        let evGroup = utilities.find(this.userGroups, g => g.Id === event.GroupId);
        if (evGroup) {
            this.selectGroup(evGroup);
        }
    }
}
