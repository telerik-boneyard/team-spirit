import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ScrollView } from 'ui/scroll-view';

import { Event, User } from '../../shared/models';
import { EventsService, UsersService, EventRegistrationsService } from '../../services';
import { utilities } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'event-list',
    templateUrl: './event-list.template.html',
    styleUrls: ['./event-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventListComponent implements OnInit {
    dateFormat: string = utilities.dateFormat;
    private _userEventsById: any = {};

    constructor(
        private _eventsService: EventsService,
        private _regsService: EventRegistrationsService,
        private _usersService: UsersService
    ) {}

    @Input() events: Event[];
    @Input() hasMore: boolean = true;
    @Output() onEventTap: EventEmitter<any> = new EventEmitter<any>();
    @Output() scrolledToBottom: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {
        this._usersService.currentUser()
            .then(user => this._eventsService.getUserEvents(user.Id))
            .then(userEvents => {
                userEvents.forEach(ev => {
                    this._userEventsById[ev.Id] = true;
                });
            });
    }

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
            return Math.abs(days) + ' days ago';
        } else {
            return 'TODAY';
        }
    }

    onLoadMore() {
        this.scrolledToBottom.emit();
    }

    hasLoaderForMore() {
        return this.scrolledToBottom.observers.length > 0;
    }
}
