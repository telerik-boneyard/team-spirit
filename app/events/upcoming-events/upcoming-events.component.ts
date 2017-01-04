import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { EventsService } from '../../services';
import { Event } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'upcoming-events',
    templateUrl: 'events/upcoming-events/upcoming-events.template.html',
    styleUrls: ['events/upcoming-events/upcoming-events.component.css']
})
export class UpcomingEventsComponent implements OnInit {
    upcomingEvents: Promise<Event[]>;
    pastEvents: Promise<Event[]>;
    dateFormat = 'MMM dd, yyyy, hh:mm a';

    constructor(
        private _eventsService: EventsService,
        private _routerExtensions: RouterExtensions,
        private _page: Page
    ) {
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
        this.upcomingEvents = this._eventsService.getUpcoming();
        this.pastEvents = this._eventsService.getPast();
    }

    showDetails(event: Event) { // UPDATED - remove this comment when this works
        this._routerExtensions.navigate(['/events/:id', {
            id: event.Id
        }]);
    }

    handleError(error) {
        console.log(JSON.stringify(error));
    }
}
