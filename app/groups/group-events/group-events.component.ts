import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { EventsService, GroupsService, AlertService, PlatformService } from '../../services';
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
    isAndroid: boolean = false;

    private _groupId: string;

    constructor(
        private _route: ActivatedRoute,
        private _alertsService: AlertService,
        private _groupsService: GroupsService,
        private _eventsService: EventsService,
        private _platform: PlatformService,
        private _routerExtensions: RouterExtensions,
        private _page: Page
    ) {
        this.isAndroid = this._platform.isAndroid;
    }

    ngOnInit() {
        this._page.actionBar.title = '';
        this._route.params.subscribe(params => {
            this._groupId = params['id'];

            this._eventsService.getUpcoming([this._groupId])
                .then(upcomingEvents => {
                    this.events = upcomingEvents;
                    return this._eventsService.getPast([this._groupId]);
                })
                .then(pastEvents => this.events = this.events.concat(pastEvents))
                .catch(this._onError.bind(this));

            this._groupsService.getById(this._groupId)
                .then(group => {
                    this._page.actionBar.title = 'Events for ' + group.Name;
                    this.group = group;
                })
                .catch(this._onError.bind(this));
        });
    }

    onEventTap(event: Event) {
        this._routerExtensions.navigateByUrl(`/events/${event.Id}`);
    }

    onBack() {
        this._routerExtensions.navigateByUrl(`/groups/${this._groupId}`);
    }

    private _onError(err) {
        if (err) {
            this._alertsService.showError(err.message);
        }
    }
}
