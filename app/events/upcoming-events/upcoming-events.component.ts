import { Component, OnInit } from '@angular/core';

import { EventsService } from '../../services';
import { Event } from '../../shared/models';

@Component({
    selector: 'upcoming-events',
    templateUrl: 'events/upcoming-events/upcoming-events.template.html'
})
export class UpcomingEventsComponent implements OnInit {
    events: Event[];
    dateFormat = 'MMM dd, yyyy, hh:mm a';

    constructor(private _eventsService: EventsService) {

    }

    ngOnInit() {
        this._eventsService.getUpcoming()
            .then(events => {
                this.events = events;
                // this.handleError(events.map(e => {return{ date: e.EventDate, opts: e.EventDateChoices }}));
            }, this.handleError);
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
            return days + ' Days';
        } else if (days < 0) {
            return Math.abs(days) + ' Days ago';
        } else {
            return 'TODAY';
        }
    }

    showDetails(event: any) {
        console.log('show details clicked');
    }

    handleError(error) {
        console.log(JSON.stringify(error));
    }
}
