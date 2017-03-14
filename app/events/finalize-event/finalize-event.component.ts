import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { AlertService, PlatformService, UsersService, EventsService, EventRegistrationsService } from '../../services';
import { Event } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'finalize-event',
    templateUrl: './finalize-event.template.html',
    styleUrls: ['./finalize-event.component.css']
})
export class FinalizeEventComponent implements OnInit {
    event: Event;
    countsBydate: { date: string, count: number }[];
    isAndroid: boolean = false;
    dateFormat: string = utilities.dateFormat;

    private _selectedDate: string;
    private _eventId: string;

    constructor(
        private _route: ActivatedRoute,
        private _alertsService: AlertService,
        private _eventsService: EventsService,
        private _platform: PlatformService,
        private _routerExtensions: RouterExtensions,
        private _page: Page
    ) {
        this.isAndroid = this._platform.isAndroid;
    }

    ngOnInit() {
        this._page.actionBar.title = 'Set final date';
        this._route.params.subscribe(p => {
            let eventId = p['id'];
            this._eventId = eventId;
            this._selectedDate = p['selectedDate'];

            let evPrm = this._eventsService.getById(this._eventId);
            let countsPrm = this._eventsService.getVoteCount(this._eventId, true);

            Promise.all<any>([evPrm, countsPrm])
                .then((res) => {
                    this.countsBydate = res[1];
                    let event: Event = res[0];
                    if (event.EventDateChoices) {
                        event.EventDateChoices = event.EventDateChoices.sort(utilities.compareForSort);
                    }
                    this.event = event;
                })
                .catch(err => err && this._alertsService.showError(err.message));
        });
    }

    onBack() {
        this._routerExtensions.back();
    }

    selectDate(date: string) {
        this._selectedDate = date;
    }

    dateIsSelected(date: string) {
        return this._selectedDate === date;
    }

    getCountText(count: number) {
        let text = `${count} vote`;
        if (count !== 1) {
            text += 's';
        }
        return text;
    }

    listVoters(dateInfo: { date: string, count: number }) {
        if (dateInfo.count > 0) {
            let date = dateInfo.date;
            let transition = utilities.getPageTransition();
            this._routerExtensions.navigate([`events/${this.event.Id}/participants`, { onlyDate: date }], { transition });
        }
    }

    finalize() {
        if (!this._selectedDate) {
            return this._alertsService.showError('Please select a final date for the event');
        }
        if (new Date(this._selectedDate) < new Date()) {
            return this._alertsService.showError('Please select a date which is in the future');
        }
        this._alertsService.askConfirmation('Once you set this date, it cannot be changed')
            .then(() => this._eventsService.finalizeEvent(this._eventId, this._selectedDate))
            .then(res => {
                if (res) {
                    return this._alertsService.showSuccess('Event date was set');
                } else {
                    return Promise.reject({ message: 'Event date was not set. Please try again later' });
                }
            })
            .then(res => {
                let transition = utilities.getReversePageTransition();
                this._routerExtensions.navigate([`events/${this._eventId}`], { clearHistory: true, transition });
            })
            .catch(err => err && this._alertsService.showError(err.message));
    }
}
