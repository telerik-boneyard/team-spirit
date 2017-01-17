import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { EventsService, AlertService, FilesService } from '../../services';
import { Event, User } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'edit-event',
    templateUrl: 'events/edit-event/edit-event.template.html',
    styleUrls: [ 'events/edit-event/edit-event.component.css' ]
})
export class EditEventComponent implements OnInit {
    event: Event;

    constructor(
        private _route: ActivatedRoute,
        private _alertsService: AlertService,
        private _routerExtensions: RouterExtensions,
        private _filesService: FilesService,
        private _eventsService: EventsService
    ) {}

    ngOnInit() {
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

                if (utilities.isLocalUrl(this.event.ImageUrl)) {
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
                return this._alertsService.showSuccess(`Group "${this.event.Name}" updated!`);
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
            .then(() => {
                return this._eventsService.deleteById(this.event.Id);
            })
            .then(() => {
                return this._alertsService.showSuccess(`Deleted "${this.event.Name}" successfully.`)
            })
            .then(() => {
                this._routerExtensions.navigate(['/events']);
            })
            .catch(err => {
                if (err) {
                    this._alertsService.showError(err.message);
                }
            });
    }

    onCancel() {
        this._routerExtensions.back();
    }
}
