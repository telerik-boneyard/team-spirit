import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as utils from 'utils/utils';

import { EventsService, UsersService } from '../../services';
import { Event, User } from '../../shared/models';

@Component({
    selector: 'event-details',
    templateUrl: 'events/event-details/event-details.template.html'
})
export class EventDetailsComponent implements OnInit {
    event: Event;
    dateFormat = 'MMM dd, yyyy, hh:mm a';
    registeredUsers: User[] = [];
    remainingUsersCount: number = 0;
    alreadyRegistered = false;

    constructor(
        private _route: ActivatedRoute,
        private _eventsService: EventsService,
        private _usersService: UsersService) { }

    ngOnInit() {
        this._route.params.subscribe(p => {
            this._eventsService.getById(p['id'])
                .then((event) => {
                    this.event = event;
                    return this._eventsService.getParticipants(this.event.Id);
                })
                .then((participants: User[]) => {
                    this.registeredUsers = participants;
                    this.remainingUsersCount = Math.max(0, this.registeredUsers.length - 3);
                    return this._usersService.currentUser();
                })
                .then(currentUser => {
                    this.alreadyRegistered = this.registeredUsers.filter(u => u.Id === currentUser.Id).length > 0;
                });
        });

    }

    getRegisterBtnText() {
        if (this.alreadyRegistered) {
            return 'Already Registered';
        } else {
            return 'Register';
        }
    }

    getRating() {
        return `Rating: 4.98 out of 5`;
    }

    getDate() {
        if (this.event.EventDate) {
            return new Date(this.event.EventDate);
        }
    }

    register() {
        if (!this.alreadyRegistered) {
            this._eventsService.registerForEvent(this.event.Id);
        }
    }

    showLocation() {
        utils.openUrl(this.event.LocationURL);
    }
}
