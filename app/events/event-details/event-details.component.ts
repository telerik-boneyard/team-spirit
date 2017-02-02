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
                    return this._updateCountsByDate();
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

    private _updateCountsByDate() {
        return this._eventsService.getDateChoicesVotes(this.event.Id)
            .then(result => this._countByDate = result.countByDate);
    }

    onEdit() {
        this._routerExtensions.navigate([`/events/${this.event.Id}/edit`]);
    }

    canEdit() {
        return this._currentUser && this.event && this.event.Owner === this._currentUser.Id;
    }

    register() {
        let dateSelectionPromise: Promise<string[]> = null;

        if (this.event.EventDate) {
            dateSelectionPromise = Promise.resolve([this.event.EventDate]);
        } else {
            dateSelectionPromise = this._openDateSelectionModal();
        }

        dateSelectionPromise.then(dateChoices => {
            if (dateChoices) {
                return this._eventsService.registerForEvent(this.event.Id, dateChoices);
            } else {
                return Promise.resolve(false);
            }
        })
        .then(didRegister => {
            if (didRegister) { // would be false if user closed modal
                let ctx = {
                    title: 'Hooooray!',
                    text: 'You have successfully registered for this event.',
                    closeTimeout: constants.modalsTimeout
                };

                this._updateInfoOnRegister();
                this._alertsService.showModal(ctx, this._vcRef, AppModalComponent);
            }
        })
        .catch(this._onError.bind(this));
    }

    changeVote() {
        let updatedChoices: string[];
        
        this._openDateSelectionModal(true)
            .then(dateChoices => {
                if (!dateChoices) {
                    return Promise.reject(false); // dont show an error, user closed the modal
                }
                if (dateChoices.length) {
                    updatedChoices = dateChoices;
                    return this._regsService.updateChoices(this.event.Id, this._currentUser.Id, dateChoices);
                }
            })
            .then(() => {
                // let oldChoices: string[] = this._userRegForThisEvent.Choices;
                // oldChoices.forEach(oc => {
                //     this._countByDate[oc]--;
                // });
                // updatedChoices.forEach(uc => {
                //     if (this._countByDate[uc]) {
                //         this._countByDate[uc] = (this._countByDate[uc] || 0) + 1;
                //     }
                // });
                this._updateCountsByDate();
                this._userRegForThisEvent.Choices = updatedChoices;
                this._alertsService.showSuccess('Date vote updated');
            })
            .catch(err => err && this._alertsService.showError(err.message));
    }

    showLocation() {
        nsUtils.openUrl(this.event.LocationURL);
    }

    toggleExpandedUsers() {
        this.registeredUsersExpanded = !this.registeredUsersExpanded;
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

    canRegister() {
        return !this.alreadyRegistered && !this.isPastEvent && this.event.OpenForRegistration && !this.event.RegistrationCompleted;
    }

    unregister() {
        this._alertsService.askConfirmation(`Unregister from ${this.event.Name}?`)
            .then(() => this._regsService.getUserRegistrationForEvent(this.event.Id, this._currentUser.Id))
            .then(userReg => {
                if (!userReg) {
                    return Promise.reject({ message: 'You are not registered for this event' })
                }
                
                this._userRegForThisEvent = userReg;
                return this._eventsService.unregisterFromEvent(this.event.Id, this._currentUser.Id);
            })
            .then(() => this._updateInfoOnUnregister())
            .then(() => this._alertsService.showSuccess(`Successfully unregistered from ${this.event.Name}`))
            .catch(err => err && this._alertsService.showError(err.message));
    }

    private _openDateSelectionModal(isChangeVote = false) {
        let opts: ModalDialogOptions = {
            context: {
                availableDates: this.event.EventDateChoices
            },
            fullscreen: true,
            viewContainerRef: this._vcRef
        };

        if (isChangeVote) {
            opts.context.title = 'Change date vote';
        }

        return this._modalService.showModal(EventRegistrationModalComponent, opts)
            .then((dateChoices: number[]) => {
                let result: string[] = null;

                if (dateChoices && dateChoices.length) {
                    this._dateChoicesMade = [];
                    dateChoices.forEach(c => this._dateChoicesMade.push(this.event.EventDateChoices[c]));
                    result = this._dateChoicesMade;
                }

                return Promise.resolve(result);
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
            // this._countByDate[dc] = this._countByDate[dc] || 0;
            // this._countByDate[dc]++;
            this._userRegForThisEvent.Choices.push(dc);
        });
        this._updateCountsByDate();
    }

    private _updateInfoOnUnregister() {
        this.alreadyRegistered = false;
        this.registeredUsers = this.registeredUsers.filter(u => u.Id !== this._currentUser.Id);
        // this._userRegForThisEvent.Choices.forEach(userChoice => {
        //     this._countByDate[userChoice] = Math.max(0, this._countByDate[userChoice] - 1);
        // });
        this._updateCountsByDate();
        this._userRegForThisEvent = null;
    }
}
