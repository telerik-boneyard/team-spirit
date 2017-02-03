import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event, User } from '../../shared/models';
import { EventsService, UsersService, EventRegistrationsService } from '../../services';
import { utilities } from '../../shared';

@Component({
    selector: 'event-list',
    templateUrl: 'events/event-list/event-list.template.html',
    styleUrls: ['events/event-list/event-list.component.css']
})
export class EventListComponent implements OnInit {
    dateFormat: string = utilities.dateFormat;
    private _userEventsById: any = {};

    constructor(
        private _eventsService: EventsService,
        private _regsService: EventRegistrationsService,
        private _usersService: UsersService
    ) {}

    ngOnInit() {
        this._usersService.currentUser()
            .then(user => this._eventsService.getUserEvents(user.Id))
            .then(userEvents => {
                userEvents.forEach(ev => {
                    this._userEventsById[ev.Id] = true;
                });
            });
    }
    
    @Input() events: Event[];
    @Output() onEventTap: EventEmitter<any> = new EventEmitter<any>();

    eventTap(event: Event) {
        this.onEventTap.emit(event);
    }

    userIsRegistered(eventId: string) {
        return this._userEventsById && this._userEventsById[eventId];
    }

    isPastEvent(event: Event) {
        return this._eventsService.isPastEvent(event);
    }

    getEventDate(event: Event) {
        let date: Date = null;

        if (event.EventDate) {
            date = new Date(event.EventDate);
        }

        return date;
    }

    getRemainingTime(event: Event) {
        let oneDay = 24 * 60 * 60 * 1000;
        let eventDate = this.getEventDate(event);

        if (!eventDate) {
            return 'TBD';
        }

        let days = Math.round((eventDate.getTime() - Date.now()) / oneDay);

        if (days > 0) {
            return days + ' days left';
        } else if (days < 0) {
            return Math.abs(days) + ' Days ago';
        } else {
            return 'TODAY';
        }
    }
}
