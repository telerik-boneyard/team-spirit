import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { EventsService, UsersService, GroupsService, AlertService } from '../../services';
import { Event } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'events',
    templateUrl: 'events/events/events.template.html',
    styleUrls: ['events/events/events.component.css']
})
export class EventsComponent implements OnInit {
    upcomingEvents: Event[];
    pastEvents: Event[];
    initialized: boolean = false;
    dateFormat: string = utilities.dateFormat;
    canAdd: boolean = false;

    constructor(
        private _usersService: UsersService,
        private _eventsService: EventsService,
        private _groupsService: GroupsService,
        private _routerExtensions: RouterExtensions,
        private _alertsService: AlertService,
        private _page: Page
    ) { }

    onAdd() {
        this._routerExtensions.navigate(['/events/add']);
    }

    ngOnInit() {
        this._page.actionBarHidden = false;

        this._usersService.currentUser()
            .then(user => {
                this.canAdd = !!user;
                return this._groupsService.getUserGroups(user.Id);
            })
            .then(userGroups => {
                if (!userGroups.length) {
                    return Promise.resolve([]);
                }
                let userGroupIds = userGroups.map(g => g.Id);
                let prm1 = this._eventsService.getPast(userGroupIds);
                let prm2 = this._eventsService.getUpcoming(userGroupIds);

                return Promise.all([prm1, prm2]);
            })
            .then((events) => {
                this.pastEvents = events[0];
                this.upcomingEvents = events[1];
                this.initialized = true;
            })
            .catch(err => this._alertsService.showError(err.message));
    }

    showDetails(event: Event) {
        this._routerExtensions.navigate([`/events/${event.Id}`]);
    }
}
