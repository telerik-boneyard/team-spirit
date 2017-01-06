import { Component } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
// import { ActivatedRoute } from '@angular/router';
// import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
// import * as utils from 'utils/utils';

import { EventsService, AlertService, UsersService, GroupsService } from '../../services';
import { Event } from '../../shared/models';
// import { EventRegistrationModalComponent } from '../event-registration-modal/event-registration-modal.component';

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
        private _router: RouterExtensions
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
                this._router.navigate(['/events']);
            })
            .catch(err => this._alertService.showError(err.message));
    }

    onCancel() {
        this._router.back();
    }
}
