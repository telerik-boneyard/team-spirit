import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { EventsService, AlertService, FilesService, PlatformService, UsersService, GroupsService } from '../../services';
import { Event, User, Group } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'edit-event',
    templateUrl: 'edit-event.template.html',
    styleUrls: [ 'edit-event.component.css' ]
})
export class EditEventComponent implements OnInit {
    event: Event;
    isAndroid: boolean = false;
    userGroups: Group[];

    constructor(
        private _route: ActivatedRoute,
        private _alertsService: AlertService,
        private _routerExtensions: RouterExtensions,
        private _filesService: FilesService,
        private _platform: PlatformService,
        private _eventsService: EventsService,
        private _usersService: UsersService,
        private _groupsService: GroupsService,
        private _page: Page
    ) {
        this.isAndroid = this._platform.isAndroid;
    }

    ngOnInit() {
        this._page.actionBar.title = 'Edit Event';
        this._getCurrentUserGroups();
        this._route.params.subscribe(p => {
            this._eventsService.getById(p['id'])
                .then((event: Event) => {
                    this.event = event;
                }, (err) => {
                    this._alertsService.showError(err.message);
                });
        });
    }

    save() {
        let validationErr = this._eventsService.validateEvent(this.event);
        if (validationErr) {
            return this._alertsService.showError(validationErr);
        }

        this._alertsService.askConfirmation('Save all changes?')
            .then(() => {
                // TODO: move to service
                let prm = Promise.resolve<{ Id: string, Uri: string }>();

                if (utilities.isLocalFileUrl(this.event.ImageUrl)) {
                    // this has been turned into local uri by the picker component
                    prm = this._filesService.uploadFromUri(this.event.ImageUrl);
                }

                return prm;
            })
            .then((uploadResult) => {
                if (uploadResult) {
                    this.event.Image = uploadResult.Id;
                }
                return this._eventsService.update(this.event);
            })
            .then(() => {
                return this._alertsService.showSuccess(`Event "${this.event.Name}" updated!`);
            })
            .then((res) => {
                this._routerExtensions.navigate([`/events/${this.event.Id}`]);
            })
            .catch(err => {
                if (err) {
                    this._alertsService.showError(err.message);
                }
            });
    }

    delete() {
        this._alertsService.askConfirmation(`Delete event "${this.event.Name}"?`)
            .then(() => this._eventsService.deleteById(this.event.Id))
            .then(() => this._alertsService.showSuccess(`Deleted "${this.event.Name}" successfully.`))
            .then(() => this._routerExtensions.navigate(['/events']))
            .catch(err => err && this._alertsService.showError(err.message));
    }

    onCancel() {
        this._routerExtensions.back();
    }

    private _getCurrentUserGroups() {
        return this._usersService.currentUser()
            .then(user => this._groupsService.getUserGroups(user.Id))
            .then(groups => this.userGroups = groups);
    }
}
