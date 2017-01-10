import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import * as utils from 'utils/utils';

import { EventsService, UsersService } from '../../services';
import { Event, User } from '../../shared/models';
import { utilities } from '../../shared';
import { EventRegistrationModalComponent } from '../event-registration-modal/event-registration-modal.component';

@Component({
    selector: 'event-details',
    templateUrl: 'events/event-details/event-details.template.html',
    styleUrls: [ 'events/event-details/event-details.component.css' ]
})
export class EventDetailsComponent implements OnInit {
    event: Event;
    dateFormat = utilities.dateFormat;
    registeredUsers: User[] = [];
    remainingUsersCount: number = 0;
    alreadyRegistered = false;
    isPastEvent = false;

    private _currentUser: User;

    constructor(
        private _route: ActivatedRoute,
        private _eventsService: EventsService,
        private _usersService: UsersService,
        private _modalService: ModalDialogService,
        private _vcRef: ViewContainerRef,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit() {
        this._route.params.subscribe(p => {
            this._eventsService.getById(p['id'])
                .then((event) => {
                    this.event = event;
                    this.isPastEvent = this._eventsService.isPastEvent(this.event);
                    return this._eventsService.getParticipants(this.event.Id);
                })
                .then((participants) => {
                    this.registeredUsers = participants;
                    this.remainingUsersCount = Math.max(0, this.registeredUsers.length - 3);
                    return this._usersService.currentUser();
                })
                .then(currentUser => {
                    this._currentUser = currentUser;
                    this.alreadyRegistered = this.registeredUsers.filter(u => u.Id === currentUser.Id).length > 0;
                })
                .catch(e => {
                    alert('An error occured: ' + JSON.stringify(e));
                });
        });
    }

    onEdit() {
        this._routerExtensions.navigate([`/events/edit/${this.event.Id}`]);
    }

    canEdit() {
        return this._currentUser && this.event && this.event.Owner === this._currentUser.Id;
    }

    getResizedImageUrl(rawUrl: string): string {
        return utilities.getAsResizeUrl(rawUrl);
    }

    getRegisterBtnText() {
        if (this.alreadyRegistered) {
            return 'Already Registered';
        } else {
            return 'Register';
        }
    }

    getRating() {
        // TODO
        return `Rating: 4.98 out of 5`;
    }

    getDate() {
        if (this.event.EventDate) {
            return new Date(this.event.EventDate);
        }
    }

    register() {
        if (this.alreadyRegistered) {
            return;
        }

        let registrationPromise: Promise<any>;

        if (this.event.EventDate) {
            registrationPromise = this._eventsService.registerForEvent(this.event.Id, [0]);
        } else {
            registrationPromise = this._openPopupAndRegister();
        }
            
        registrationPromise.then((didRegister) => {
            if (didRegister) { // would be false if user closed modal
                this.alreadyRegistered = true;
                this._usersService.getById(this._currentUser.Id, {
                    Image: {
                        ReturnAs: 'ImageUrl',
                        SingleField: 'Uri'
                    }
                })
                .then(user => {
                    this.registeredUsers.unshift(user);
                });
            }
        })
        .catch((err) => {
            console.log('event registration error: ' + JSON.stringify(err));
        });
    }

    showLocation() {
        utils.openUrl(this.event.LocationURL);
    }

    private _openPopupAndRegister() {
        let opts: ModalDialogOptions = {
            context: {
                availableDates: this.event.EventDateChoices
            },
            fullscreen: true,
            viewContainerRef: this._vcRef
        };

        return this._modalService.showModal(EventRegistrationModalComponent, opts)
            .then((dateChoices: number[]) => {
                if (dateChoices && dateChoices.length) {
                    return this._eventsService.registerForEvent(this.event.Id, dateChoices);
                } else {
                    return Promise.resolve(false);
                }
            });
    }
}
