import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

import { EventsService } from '../../services';
import { Event } from '../../shared/models';

@Component({
    selector: 'upcoming-events',
    templateUrl: 'events/upcoming-events/upcoming-events.template.html',
    styleUrls: [ 'events/upcoming-events/upcoming-events.component.css' ]
})
export class UpcomingEventsComponent implements OnInit {
    events: Event[];
    dateFormat = 'MMM dd, yyyy, hh:mm a';

    constructor(private _eventsService: EventsService, private _routerExtensions: RouterExtensions) {
    }

    ngOnInit() {
        this._eventsService.getUpcoming()
            .then(events => {
                this.events = events;
                // this.handleError(events);
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
        let clickedEvent = this.events[event.index];
        this._routerExtensions.navigate(['/events/:id', {
            id: clickedEvent.Id
        }]);
    }

    handleError(error) {
        console.log(JSON.stringify(error));
    }
}
