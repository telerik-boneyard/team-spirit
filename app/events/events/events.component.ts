import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';
import * as viewModule from 'ui/core/view';

import { EventsService, UsersService, GroupsService, AlertService, EverliveProvider } from '../../services';
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
    userGroups: Group[];
    dateFormat: string = utilities.dateFormat;
    canAdd: boolean = false;
    hasMoreUpcoming: boolean = true;
    hasMorePast: boolean = true;
    hasPastEvents: boolean = false;
    
    private _tabIndex = 0;
    private _upcomingPage = 0;
    private _pastPage = 0;
    private _userGroupIds: string[];
    private readonly _pageSize = 7;
    private _lockPast: boolean = false;
    private _lockUpcoming: boolean = false;

    constructor(
        private _usersService: UsersService,
        private _eventsService: EventsService,
        private _groupsService: GroupsService,
        private _routerExtensions: RouterExtensions,
        private _alertsService: AlertService,
        private _page: Page
    ) {}

    set tabIndex(val: number) {
        this._tabIndex = val;
        if (!this._userGroupIds) {
            return;
        }
        if (this._tabIndex === 0 && !this.upcomingEvents) {
            this.initializeTab(false);
        } else if (this._tabIndex === 1 && !this.pastEvents) {
            this.initializeTab(true);
        }
    }

    get tabIndex() {
        return this._tabIndex;
    }

    onAdd() {
        this._routerExtensions.navigateByUrl('/events/add');
    }

    ngOnInit() {
        // this._routerExtensions.navigateByUrl(`/events/d71acd60-f9df-11e6-8f26-e37a026d55d1/finalize`);
        // this._routerExtensions.navigateByUrl('/groups');
        // this._routerExtensions.navigateByUrl(`/groups/4e292710-9b69-11e6-901f-5dd3e4bc26b4/events`); // BS
        // this._routerExtensions.navigateByUrl(`/groups/688e7d40-d682-11e6-9347-a37d034954b1/members`); // Test Group

        this._page.actionBar.title = 'Events';
        this._page.actionBarHidden = false;

        this._usersService.currentUser()
            .then(user => {
                this.canAdd = !!user;
                return this._groupsService.getUserGroups(user.Id);
            })
            .then(userGroups => {
                this.userGroups = userGroups;
                this._userGroupIds = userGroups.map(g => g.Id);
                return this._eventsService.hasPastEvents(this._userGroupIds);
            })
            .then((hasPast) => {
                this.hasPastEvents = hasPast;
                return this.initializeTab(this.tabIndex === 1);
            })
            .catch(err => this._alertsService.showError(err.message));
    }

    canAddEvent() {
        return this.isInitialized() && this.canAdd && this.userGroups.length;
    }

    hasNotJoinedGroup() {
        return this.isInitialized() && !this.hasAnyLoadedEvents() && !this.userGroups.length; // protected by isInitialized
    }

    joinedGroupsHaveNoEvents() {
        return this.isInitialized() && this.hasNoEvents() && this.userGroups.length; // protected by isInitialized
    }

    showDetails(event: Event) {
        this._routerExtensions.navigate([`/events/${event.Id}`]);
    }

    loadUpcomingEvents() {
        if (!this.hasMoreUpcoming || this._lockUpcoming) {
            return Promise.resolve();
        }
        this._lockUpcoming = true;
        return this._eventsService.getUpcoming(this._userGroupIds, this._upcomingPage, this._pageSize)
            .then(events => {
                this.upcomingEvents = (this.upcomingEvents || []).concat(events);
                this.hasMoreUpcoming = !!(events && events.length === this._pageSize);
                if (this.hasMoreUpcoming) {
                    this._upcomingPage++;
                }
                this._lockUpcoming = false;
            })
            .catch(err => {
                this.hasMoreUpcoming = true;
                this._lockUpcoming = false;
                console.log(JSON.stringify(err));
            });
    }

    loadPastEvents() {
        if (!this.hasMorePast || this._lockPast) {
            return Promise.resolve();
        }
        this._lockPast = true;
        return this._eventsService.getPast(this._userGroupIds, this._pastPage, this._pageSize)
            .then(events => {
                this.pastEvents = (this.pastEvents || []).concat(events);
                this.hasMorePast = !!(events && events.length === this._pageSize);
                if (this.hasMorePast) {
                    this._pastPage++;
                }
                this._lockPast = false;
            })
            .catch(err => {
                this._lockPast = false;
                console.log(JSON.stringify(err));
            });
    }

    initializeTab(loadPast) {
        let prm: Promise<any>;
        if (loadPast) {
            prm = this.loadPastEvents();
        } else {
            prm = this.loadUpcomingEvents();
        }
        return prm;
    }

    goToAllGroups() {
        this._routerExtensions.navigate(['groups', { selectedTabIndex: 1 }]);
    }

    isInitialized() {
        return this.userGroups && (this.upcomingEvents || this.pastEvents);
    }

    hasAnyLoadedEvents() {
        return (this.upcomingEvents && this.upcomingEvents.length) || (this.pastEvents && this.pastEvents.length);
    }

    hasNoEvents() {
        return this.upcomingEvents && !this.upcomingEvents.length && !this.hasPastEvents;
    }
}
