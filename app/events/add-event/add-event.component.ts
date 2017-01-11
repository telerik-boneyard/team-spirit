import { Component } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

import { EventsService, AlertService, UsersService, GroupsService } from '../../services';
import { Event } from '../../shared/models';

@Component({
    selector: 'add-event',
    templateUrl: 'events/add-event/add-event.template.html',
    styleUrls: [ 'events/add-event/add-event.component.css' ]
})
export class AddEventComponent {
    newEvent: Event;

    constructor(
        private _eventService: EventsService,
        private _alertService: AlertService,
        private _usersService: UsersService,
        private _routerExtensions: RouterExtensions
    ) {
        this.newEvent = new Event();
    }

    onCreate() {
        this._usersService.currentUser()
            .then((currentUser) => {
                this.newEvent.OrganizerId = currentUser.Id;
                let errMsg = this._eventService.validateEvent(this.newEvent);

                if (errMsg) {
                    return Promise.reject({ message: errMsg });
                }
            })
            .then(() => {
                return this._eventService.create(this.newEvent);
            })
            .then((res) => {
                this._routerExtensions.navigate(['/events']);
            })
            .catch(err => this._alertService.showError(err.message));
    }

    onCancel() {
        this._routerExtensions.back();
    }
}
