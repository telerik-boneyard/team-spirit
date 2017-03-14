import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { EventsService, PlatformService, AlertService, UsersService } from '../../services';
import { AppModalComponent } from '../../shared';
import { Event, EventRegistration, User } from '../../shared/models';
import { utilities, constants } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'event-date-selection',
    templateUrl: './event-date-selection.template.html',
    styleUrls: [ './event-date-selection.component.css' ]
})
export class EventDateSelectionComponent implements OnInit {
    event: Event;
    isAndroid: boolean = false;
    dateFormat = utilities.dateFormat;
    dateOptions: { date: string, selected: boolean }[];

    private _votesByDate: { [isoDate: string]: number };
    private _userReg: EventRegistration;

    constructor(
        private _page: Page,
        private _route: ActivatedRoute,
        private _vcRef: ViewContainerRef,
        private _platform: PlatformService,
        private _usersService: UsersService,
        private _alertsService: AlertService,
        private _eventsService: EventsService,
        private _routerExtensions: RouterExtensions,
    ) {
        this.isAndroid = this._platform.isAndroid;
    }
    
    ngOnInit() {
        this._route.params.subscribe(p => {
            let eventId: string = p['id'];

            let eventRegObj = this._getParam<EventRegistration>(p, 'userReg');
            let eventObj = this._getParam<Event>(p, 'eventObj');

            let eventPromise = Promise.resolve(eventObj);
            let eventRegPromise = Promise.resolve(eventRegObj);

            if (eventObj) {
                eventPromise = Promise.resolve(eventObj);
            } else {
                eventPromise = this._eventsService.getById(eventId)
                    .then(e => {
                        if (e.EventDateChoices) {
                            // these are actually parsed to Date objects by the Everlive SDK
                            e.EventDateChoices = e.EventDateChoices.sort(utilities.compareForSort);
                        }
                        return e;
                    });
            }

            if (eventRegObj) {
                eventRegPromise = Promise.resolve(eventRegObj);
            } else {
                eventRegPromise = this._usersService.currentUser()
                    .then(u => this._eventsService.getUserRegistration(eventId, u.Id));
            }

            // TODO: event dates can be strings or date objects,
            // depending on where the event came from - param or request
            Promise.all<any>([eventPromise, eventRegPromise]).then(results => {
                let ev: Event = results[0];
                this._userReg = results[1];

                this.dateOptions = ev.EventDateChoices.map((d: Date|string) => {
                    let result: any = { date: d, selected: false };
                    if (d instanceof Date) {
                        result.date = d.toISOString();
                    }
                    if (this._userReg) {
                        result.selected = this._userHasVotedForDate(this._userReg.Choices, result.date);
                    }
                    return result;
                });

                this.event = ev;
            })
            .catch(e => e && this._alertsService.showError(e.message));

            this._eventsService.getVoteCount(eventId)
                .then(res => this._votesByDate = res)
                .catch(e => e && this._alertsService.showError(e.message));
        });
    }

    onDone() {
        let selectedDates = this.dateOptions.filter(o => o.selected).map(o => o.date);
        if (!selectedDates.length) {
            return this._alertsService.showError('You must select at least one date');
        }
        let promise = this._userReg ? this._changeVote(selectedDates) : this._register(selectedDates);
        promise.then(() => {
            let transition = utilities.getReversePageTransition();
            this._routerExtensions.navigate([`/events/${this.event.Id}`], { transition, clearHistory: true });
        })
        .catch(e => e && this._alertsService.showError(e.message));
    }

    onBack() {
        this._routerExtensions.back();
    }
    
    getVotesText(isoDate: string) {
        let count = this._votesByDate[isoDate];
        let text = `${count} vote`;
        if (count !== 1) {
            text += 's';
        }
        return text;
    }

    votesInitialized() {
        return !!this._votesByDate;
    }

    private _register(selectedDates: string[]) {
        return this._eventsService.registerForEvent(this.event.Id, selectedDates)
            .then(results => {
                let ctx = {
                    title: 'Hooooray!',
                    text: 'You have successfully voted for event date',
                    closeTimeout: constants.modalsTimeout
                };

                return this._alertsService.showModal(ctx, this._vcRef, AppModalComponent);
            })
    }

    private _changeVote(selectedDates: string[]) {
        return this._usersService.currentUser()
            .then(user => this._eventsService.updateUserVote(this.event.Id, user.Id, selectedDates));
    }

    private _getParam<T>(params: { [key: string]: any }, paramName: string): T {
        if (params[paramName]) {
            return JSON.parse(params[paramName]);
        }
    }

    private _setPageTitle(isChange = false) {
        let title = 'Vote for date';
        if (isChange) {
            title = 'Change vote';
        }
        this._page.actionBar.title = title;
    }

    private _userHasVotedForDate(userDates: string[], date: string) {
        return userDates.some((d: any) => {
            let dateAsIsoStr = d;
            if (d instanceof Date) {
                dateAsIsoStr = d.toISOString();
            }
            return dateAsIsoStr === date;
        });
    }
}
