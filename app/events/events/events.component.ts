import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { EventsService, UsersService, GroupsService, AlertService } from '../../services';
import { Event, Group } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'events',
    templateUrl: './events.template.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
    upcomingEvents: Event[];
    pastEvents: Event[];
    userGroups: Group[] = [];
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
        this._routerExtensions.navigateByUrl('/events/add');
    }

    ngOnInit() {
        // this._routerExtensions.navigateByUrl(`/events/a0c52f80-d905-11e6-a6d8-b1a296ec2f6d/participants`);
        // this._routerExtensions.navigateByUrl('/groups');
        // this._routerExtensions.navigateByUrl(`/groups/4e292710-9b69-11e6-901f-5dd3e4bc26b4/members`); // BS
        // this._routerExtensions.navigateByUrl(`/groups/688e7d40-d682-11e6-9347-a37d034954b1/members`); // Test Group

        this._page.actionBar.title = 'Events';
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
                this.userGroups = userGroups;
                let userGroupIds = userGroups.map(g => g.Id);
                let prm1 = this._eventsService.getPast(userGroupIds);
                let prm2 = this._eventsService.getUpcoming(userGroupIds);

                return Promise.all([prm1, prm2]);
            })
            .then((events) => {
                this.pastEvents = events[0] || [];
                this.upcomingEvents = events[1] || [];
                this.initialized = true;
            })
            .catch(err => this._alertsService.showError(err.message));
    }

    canAddEvent() {
        return this.initialized && this.canAdd && this.userGroups.length;
    }

    showDetails(event: Event) {
        this._routerExtensions.navigate([`/events/${event.Id}`]);
    }

    goToAllGroups() {
        this._routerExtensions.navigate(['groups', { selectedTabIndex: 1 }]);
    }
}
