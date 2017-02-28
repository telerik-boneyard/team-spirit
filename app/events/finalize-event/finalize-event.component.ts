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
                    this.event = res[0];
                    this.countsBydate = res[1];
                })
                .catch(err => err && this._alertsService.showError(err.message));
        });
    }

    onBack() {
        this._routerExtensions.navigateByUrl(`events/${this._eventId}`);
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
            let params: { onlyDate: string, selectedDate?: string } = { onlyDate: date };
            if (this._selectedDate) {
                params.selectedDate = this._selectedDate;
            }
            this._routerExtensions.navigate([`events/${this.event.Id}/participants`, params]);
        }
    }

    finalize() {
        if (!this._selectedDate) {
            return this._alertsService.showError('Please select a final date for the event');
        }

        this._alertsService.askConfirmation('Once you set this date, it cannot be changed')
            .then(() => this._eventsService.finalizeEvent(this._eventId, this._selectedDate))
            .then(res => {
                if (res) {
                    this._alertsService.showSuccess('Event date was set');
                    this._routerExtensions.navigateByUrl(`events/${this._eventId}`);
                } else {
                    this._alertsService.showError('Event date was not set. Please try again later');
                }
            })
            .catch(err => err && this._alertsService.showError(err.message));
    }
}
