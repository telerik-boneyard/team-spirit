import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { AlertService, PlatformService, UsersService, EventsService, EventRegistrationsService } from '../../services';
import { User, Event, EventRegistration } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'event-participants',
    templateUrl: 'events/event-participants/event-participants.template.html',
    styleUrls: ['events/event-participants/event-participants.component.css']
})
export class EventParticipantsComponent implements OnInit {
    event: Event;
    participants: User[];
    isAndroid: boolean = false;
    participantsByDate: any = {};
    registrations: EventRegistration[];
    dateFormat: string = utilities.dateFormat;
    dateGroupings: any = {};
    eventDates: any[] = [];

    constructor(
        private _route: ActivatedRoute,
        private _alertsService: AlertService,
        private _usersService: UsersService,
        private _eventsService: EventsService,
        private _platform: PlatformService,
        private _routerExtensions: RouterExtensions,
        private _regsService: EventRegistrationsService
    ) {
        this.isAndroid = this._platform.isAndroid;
    }

    ngOnInit() {
        this._route.params.subscribe(p => {
            let eventId = p['id'];

            let participantsPrm = this._eventsService.getParticipants(eventId)
                .then(p => this.participants = p);

            let eventPrm = this._eventsService.getById(eventId)
                .then(e => this.event = e);
            
            let regsPrm = this._regsService.getForEvent(eventId)
                .then(r => this.registrations = r);

            Promise.all<any>([eventPrm, participantsPrm, regsPrm])
                .then(() => {
                    this._groupParticipantsByDate();
                });
        });
    }

    onBack() {
        this._routerExtensions.back();
    }

    isInitialized() {
        let keys = Object.keys(this.dateGroupings);
        return keys.length > 0;
    }

    getGroupingDates() {
        return Object.keys(this.dateGroupings);
    }

    getParticipants(date: string|Date) {
        if (date instanceof Date) {
            date = date.toISOString();
        }
        return this.dateGroupings[date];
    }

    hasVoters(date: string|Date) {
        let participants = this.getParticipants(date);
        return !!participants && participants.length > 0;
    }

    getOldDates() {
        let result = this.getGroupingDates();
        result = result.filter(d => {
            let isEventDate = this.eventDates.some((evDate: Date|string) => {
                if (evDate instanceof Date) {
                    evDate = evDate.toISOString();
                }
                return evDate === d;
            });
            return !isEventDate;
        });

        return result;
    }

    hasOldDates() {
        let oldDates = this.getOldDates();
        return !!oldDates && oldDates.length > 0;
    }

    private _groupParticipantsByDate() {
        let usersById: any = {};
        this.participants.forEach(u => usersById[u.Id] = u);
        
        this.registrations.forEach(reg => {
            let user: User = usersById[reg.UserId];
            reg.Choices.forEach((c: any) => {
                let isoDate = c;
                if (c instanceof Date) {
                    isoDate = c.toISOString();
                }
                this.dateGroupings[isoDate] = this.dateGroupings[isoDate] || [];
                this.dateGroupings[isoDate].push(user);
            });
        });

        let organizer: any = usersById[this.event.OrganizerId];
        if (organizer) {
            organizer._label = 'organizer'; // this is displayed by the user list
        }

        this.eventDates = [];
        if (this.event.EventDate) {
            this.eventDates = [this.event.EventDate];
        } else {
            this.eventDates = this.event.EventDateChoices;
        }
    }
}
