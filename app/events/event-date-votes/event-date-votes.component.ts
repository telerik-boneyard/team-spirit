import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EventsService, AlertService } from '../../services';
import { Event } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'event-date-votes',
    templateUrl: 'events/event-date-votes/event-date-votes.template.html',
    styleUrls: [ 'events/event-date-votes/event-date-votes.component.css' ]
})
export class EventDateVotesComponent implements OnInit {
    event: Event;
    countsByDate: any; // obj with keys the dats and values the counts
    dateFormat: string = utilities.dateFormat;

    constructor(
        private _route: ActivatedRoute,
        private _alertsService: AlertService,
        private _eventsService: EventsService
    ) {}

    ngOnInit() {
        this._route.params.subscribe(params => {
            this._eventsService.getDateChoicesVotes(params['id'])
                .then(result => {
                    this.event = result.event;
                    this.countsByDate = result.countByDate;
                });
        });
    }
}
