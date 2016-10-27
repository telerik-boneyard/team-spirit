import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EventsService } from '../../services';
import { Event } from '../../shared/models';

@Component({
    selector: 'event-details',
    templateUrl: 'events/event-details/event-details.template.html'
})
export class EventDetailsComponent {
    event: Event;
    dateFormat = 'MMM dd, yyyy, hh:mm a';

    constructor(
        private _route: ActivatedRoute,
        private _eventsService: EventsService) {
        this._route.params.subscribe(p => {
            this._eventsService.getById(p['id'])
                .then((event) => {
                    this.event = event;
                });
        });
    }

    getRating() {
        return `Rating: 4.98 out of 5`;
    }

    getDate() {
        if (this.event.EventDate) {
            return new Date(this.event.EventDate);
        }
    }
}
