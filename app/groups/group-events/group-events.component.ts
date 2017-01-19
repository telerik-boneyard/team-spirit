import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { EventsService, GroupsService, AlertService } from '../../services';
import { Event, Group } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'group-events',
    templateUrl: 'groups/group-events/group-events.template.html',
    styleUrls: ['groups/group-events/group-events.component.css']
})
export class GroupEventsComponent implements OnInit {
    events: Event[];
    group: Group;

    constructor(
        private _route: ActivatedRoute,
        private _alertsService: AlertService,
        private _groupsService: GroupsService,
        private _eventsService: EventsService,
        private _routerExtensions: RouterExtensions
    ) {}

    ngOnInit() {
        this._route.params.subscribe(params => {
            let groupId = params['id'];

            this._eventsService.getByGroupId(groupId)
                .then(events => {
                    this.events = events;
                })
                .catch(this._onError.bind(this));
            
            this._groupsService.getById(groupId)
                .then(group => {
                    this.group = group;
                })
                .catch(this._onError.bind(this));
        });
    }
    
    onEventTap(event: Event) {
        this._routerExtensions.navigateByUrl(`/events/${event.Id}`);
    }

    onBack() {
        this._routerExtensions.back();
    }

    private _onError(err) {
        if (err) {
            this._alertsService.showError(err.message);
        }
    }
}
