import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { EventsService, UsersService, GroupsService, AlertService } from '../../services';
import { Event, Group } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'events',
    templateUrl: 'events/events/events.template.html',
    styleUrls: ['events/events/events.component.css']
})
export class EventsComponent implements OnInit {
    upcomingEvents: Event[] = [];
    pastEvents: Event[] = [];
    userGroups: Group[] = [];
    initialized: boolean = false;
    dateFormat: string = utilities.dateFormat;
    canAdd: boolean = false;
    hasMoreUpcoming: boolean = true;
    hasMorePast: boolean = true;


    private _upcomingPage = 0;
    private _pastPage = 0;
    private _userGroupIds: string[];
    private readonly _pageSize = 3;

    constructor(
        private _usersService: UsersService,
        private _eventsService: EventsService,
        private _groupsService: GroupsService,
        private _routerExtensions: RouterExtensions,
        private _alertsService: AlertService,
        private _page: Page
    ) {}

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
                this._userGroupIds = userGroups.map(g => g.Id);
                let pastEventsPrm = this.loadPastEvents();
                let upcomingEventsPrm = this.loadUpcomingEvents();

                return Promise.all([pastEventsPrm, upcomingEventsPrm]);
            })
            .then((events) => this.initialized = true)
            .catch(err => this._alertsService.showError(err.message));
    }

    canAddEvent() {
        return this.initialized && this.canAdd && this.userGroups.length;
    }

    showDetails(event: Event) {
        this._routerExtensions.navigate([`/events/${event.Id}`]);
    }

    private _lockUpcoming: boolean = false;
    loadUpcomingEvents() {
        if (!this.hasMoreUpcoming || this._lockUpcoming) {
            return;
        }
        this._lockUpcoming = true;
        // this.hasMoreUpcoming = false;
        // console.log(`getting upc page: ${this._upcomingPage}`);
        return this._eventsService.getUpcoming(this._userGroupIds, this._upcomingPage, this._pageSize)
            .then(events => {
                // console.log(`got upc: ${events.length}`);
                // this.upcomingEvents = this.upcomingEvents.concat(events);
                this.upcomingEvents = [...this.upcomingEvents, ...events];
                this.hasMoreUpcoming = !!(events && events.length === this._pageSize);
                if (this.hasMoreUpcoming) {
                    this._upcomingPage++;
                }
                this._lockUpcoming = false;
                // console.log(`upcpage: ${this._upcomingPage}`);
            })
            .catch(err => {
                this.hasMoreUpcoming = true;
                this._lockUpcoming = false;
                console.log(JSON.stringify(err));
            });
    }

    private _lockPast: boolean = false;
    loadPastEvents() {
        if (!this.hasMorePast || this._lockPast) {
            return;
        }
        this._lockPast = true;
        // console.log(`getting upc page: ${this._pastPage}`);
        return this._eventsService.getPast(this._userGroupIds, this._pastPage, this._pageSize)
            .then(events => {
                // console.log(`got past: ${events.length}`);
                this.pastEvents = this.pastEvents.concat(events);
                // this.pastEvents = [...this.pastEvents, ...events];
                this.hasMorePast = !!(events && events.length === this._pageSize);
                if (this.hasMorePast) {
                    this._pastPage++;
                }
                this._lockPast = false;
                // console.log(`pastpage: ${this._pastPage}`);
            })
            .catch(err => {
                this._lockPast = false;
                console.log(JSON.stringify(err));
            });
    }
}
