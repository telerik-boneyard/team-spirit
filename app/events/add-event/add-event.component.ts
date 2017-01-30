import { Component, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { EventCreationModalComponent } from '../event-creation-modal/event-creation-modal.component';
import { Event, Group } from '../../shared/models';
import { EventsService, AlertService, UsersService, GroupsService, FilesService, PlatformService } from '../../services';
import { utilities } from '../../shared';

@Component({
    selector: 'add-event',
    templateUrl: 'events/add-event/add-event.template.html',
    styleUrls: [ 'events/add-event/add-event.component.css' ]
})
export class AddEventComponent {
    newEvent: Event;
    isAndroid: boolean = false;

    constructor(
        private _routerExtensions: RouterExtensions,
        private _groupsService: GroupsService,
        private _filesService: FilesService,
        private _eventService: EventsService,
        private _alertService: AlertService,
        private _usersService: UsersService,
        private _platform: PlatformService,
        private _vcRef: ViewContainerRef,
        private _page: Page
    ) {
        this.newEvent = new Event();
        this.isAndroid = this._platform.isAndroid;
    }

    ngOnInit() {
        this._page.actionBar.title = 'New Event';
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
                // TODO: move to service
                let prm = Promise.resolve<{ Id: string, Uri: string }>();

                if (utilities.isLocalFileUrl(this.newEvent.ImageUrl)) {
                    // this has been turned into local uri by the picker component
                    prm = this._filesService.uploadFromUri(this.newEvent.ImageUrl);
                }

                return prm;
            })
            .then((uploadResult) => {
                if (uploadResult) {
                    this.newEvent.Image = uploadResult.Id;
                }
                let creationPromise = this._eventService.create(this.newEvent);
                let groupPromise = this._groupsService.getById(this.newEvent.GroupId);
                return Promise.all<any>([groupPromise, creationPromise]);;
            })
            .then((data) => {
                let group: Group = data[0];
                let ctx: any = { groupName: group.Name };
                return this._alertService.showModal(ctx, this._vcRef, EventCreationModalComponent);
            })
            .then(() => {
                this._routerExtensions.navigateByUrl('/events');
            })
            .catch(err => err && this._alertService.showError(err.message));
    }

    onCancel() {
        this._routerExtensions.back();
    }
}
