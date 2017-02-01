import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import * as nsUtils from 'utils/utils';
import { Page } from 'ui/page';

import { Event, User, EventRegistration } from '../../shared/models';
import { utilities, constants, AppModalComponent } from '../../shared';
import { EventRegistrationModalComponent } from '../event-registration-modal/event-registration-modal.component';
import {
    EventsService,
    UsersService,
    AlertService,
    PlatformService,
    EventRegistrationsService
} from '../../services';

@Component({
    selector: 'event-details',
    templateUrl: 'events/event-details/event-details.template.html',
    styleUrls: [ 'events/event-details/event-details.component.css' ]
})
export class EventDetailsComponent implements OnInit {
    event: Event;
    dateFormat = utilities.dateFormat;
    registeredUsers: User[] = [];
    remainingUsersCount: number = 0;
    alreadyRegistered = false;
    isPastEvent = false;
    registeredUsersExpanded = false;
    isAndroid: boolean = false;

    private _eventId: string = null;
    private _countByDate: any;
    private _currentUser: User;
    private _userRegForThisEvent: EventRegistration;
    private _dateChoicesMade: string[] = [];

    constructor(
        private _route: ActivatedRoute,
        private _alertsService: AlertService,
        private _eventsService: EventsService,
        private _usersService: UsersService,
        private _modalService: ModalDialogService,
        private _vcRef: ViewContainerRef,
        private _platform: PlatformService,
        private _routerExtensions: RouterExtensions,
        private _regsService: EventRegistrationsService,
        private _page: Page
    ) {
        this.isAndroid = this._platform.isAndroid;
    }

    ngOnInit() {
        this._page.actionBar.title = '';
        this._route.params.subscribe(p => {
            this._eventId = p['id'];
            this._eventsService.getById(this._eventId)
                .then((event) => {
                    this.event = event;
                    this._page.actionBar.title = event.Name;
                    this.isPastEvent = this._eventsService.isPastEvent(this.event);
                    return this._eventsService.getDateChoicesVotes(event.Id);
                })
                .then((result) => {
                    this._countByDate = result.countByDate;
                })
                .catch(this._onError.bind(this));

            this._usersService.currentUser()
                .then(currentUser => {
                    this._currentUser = currentUser;
                    return this._eventsService.getParticipants(this._eventId);
                })
                .then((participants) => {
                    this.registeredUsers = participants;
                    this.alreadyRegistered = this.registeredUsers.some(u => u.Id === this._currentUser.Id);
                    this.remainingUsersCount = Math.max(0, this.registeredUsers.length - 3);
                })
                .catch(this._onError.bind(this));
            
            this._usersService.currentUser()
                .then(user => this._regsService.getUserRegistrationForEvent(this._eventId, user.Id))
                .then(userReg => this._userRegForThisEvent = userReg);
        });
    }

    onEdit() {
        this._routerExtensions.navigate([`/events/${this.event.Id}/edit`]);
    }

    canEdit() {
        return this._currentUser && this.event && this.event.Owner === this._currentUser.Id;
    }

    register() {
        if (this.alreadyRegistered) {
            return;
        }

        let registrationPromise: Promise<any>;

        if (this.event.EventDate) {
            registrationPromise = this._eventsService.registerForEvent(this.event.Id, [this.event.EventDate]);
        } else {
            registrationPromise = this._openPopupAndRegister();
        }

        registrationPromise.then((didRegister) => {
            if (didRegister) {
            }
            return didRegister;
        })
        .then(didRegister => {
            if (didRegister) { // would be false if user closed modal
                let ctx = {
                    title: 'Hooooray!',
                    text: 'You have successfully registered for this event.',
                    closeTimeout: constants.modalsTimeout
                };

                this._alertsService.showModal(ctx, this._vcRef, AppModalComponent);
                this._updateInfoOnRegister();
            }
        })
        .catch(this._onError.bind(this));
    }

    showLocation() {
        nsUtils.openUrl(this.event.LocationURL);
    }

    toggleExpandedUsers() {
        this.registeredUsersExpanded = !this.registeredUsersExpanded;
    }

    collapseExpandedUsers() {
        this.registeredUsersExpanded = false;
    }

    getAllRegisteredUserNames() {
        return this.registeredUsers.map(u => u.DisplayName || u.Username).join(', ');
    }

    onBack() {
        this._routerExtensions.navigateByUrl('/events');
    }

    countsInitialized() {
        return !!this._countByDate;
    }

    getVoteText(date: string) {
        return ` - ${this._countByDate[date] || 0} votes`
    }

    userVotedForDate(date: Date) {
        return !!this._userRegForThisEvent && this._userRegForThisEvent.Choices.some((r: any) => r.toISOString() === date.toISOString());
    }

    onParticipantsTap() {
        this._routerExtensions.navigateByUrl(`/events/${this.event.Id}/participants`);
    }

    private _openPopupAndRegister() {
        let opts: ModalDialogOptions = {
            context: {
                availableDates: this.event.EventDateChoices
            },
            fullscreen: true,
            viewContainerRef: this._vcRef
        };

        return this._modalService.showModal(EventRegistrationModalComponent, opts)
            .then((dateChoices: number[]) => {
                if (dateChoices && dateChoices.length) {
                    dateChoices.forEach(c => this._dateChoicesMade.push(this.event.EventDateChoices[c]));
                    return this._eventsService.registerForEvent(this.event.Id, this._dateChoicesMade);
                } else {
                    return Promise.resolve(false);
                }
            });
    }

    private _onError(err) {
        if (err) {
            this._alertsService.showError(err && err.message);
        }
    }

    private _updateInfoOnRegister() {
        this.alreadyRegistered = true;
        this.registeredUsers.unshift(this._currentUser);
        this._userRegForThisEvent = this._userRegForThisEvent || ({ Choices: [] } as EventRegistration);
        this._dateChoicesMade.forEach(dc => {
            this._countByDate[dc] = this._countByDate[dc] || 0;
            this._countByDate[dc]++;
            this._userRegForThisEvent.Choices.push(dc);
        });
    }
}
