import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import * as nsUtils from 'utils/utils';
import { Page } from 'ui/page';
import { action } from 'ui/dialogs';
import * as frameModule from 'ui/frame';

import { Event, Group, User, EventRegistration } from '../../shared/models';
import { utilities, constants, AppModalComponent } from '../../shared';
import {
    EventsService,
    GroupsService,
    UsersService,
    AlertService,
    PlatformService,
    EventRegistrationsService
} from '../../services';

@Component({
    moduleId: module.id,
    selector: 'event-details',
    templateUrl: './event-details.template.html',
    styleUrls: [ './event-details.component.css' ]
})
export class EventDetailsComponent implements OnInit {
    event: Event;
    dateFormat = utilities.dateFormat;
    registeredUsers: User[] = [];
    remainingUsersCount: number = 0;
    alreadyRegistered = false;
    isPastEvent = false;
    registeredUsersExpanded = false;
    participationChanged: boolean = false;
    isAndroid: boolean = false;

    private _eventId: string = null;
    private _countByDate: any;
    private _currentUser: User;
    private _userRegForThisEvent: EventRegistration;
    private _dateChoicesMade: string[] = [];
    private _actions: string[] = [];
    private _isVoting: boolean = false;

    constructor(
        private _route: ActivatedRoute,
        private _alertsService: AlertService,
        private _eventsService: EventsService,
        private _groupsService: GroupsService,
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
            let event = this._eventsService.getById(this._eventId)
                .then((event) => {
                    if (event.EventDateChoices) {
                        event.EventDateChoices = event.EventDateChoices.sort(utilities.compareForSort);
                    }
                    this.event = event;
                    this._page.actionBar.title = event.Name;
                    this.isPastEvent = this._eventsService.isPastEvent(this.event);
                    if (!this.isPastEvent) {
                        this._updateCountsByDate();
                    }
                })
                .catch(err => err && this._alertsService.showError(err.message));

            let currentUser = this._usersService.currentUser()
                .then(currentUser => {
                    this._currentUser = currentUser;
                    return this._eventsService.getParticipants(this._eventId);
                })
                .then((participants) => {
                    this.registeredUsers = participants;
                    this.alreadyRegistered = this.registeredUsers.some(u => u.Id === this._currentUser.Id);
                    this.remainingUsersCount = Math.max(0, this.registeredUsers.length - 3);
                })
                .catch(err => err && this._alertsService.showError(err.message));

            let user = this._usersService.currentUser()
                .then(user => this._regsService.getUserRegistrationForEvent(this._eventId, user.Id))
                .then(userReg => this._userRegForThisEvent = userReg);

            Promise.all([event, currentUser, user])
                .then(() => this._setupActions());
        });
    }

    onEdit() {
        this._navigate(`/events/${this.event.Id}/edit`);
    }

    canGoBack() {
        return this._routerExtensions.canGoBack();
    }

    canEdit() {
        return this._currentUser && this.event && !this.isPastEvent && this.event.Owner === this._currentUser.Id;
    }

    deleteEvent() {
        this._alertsService.askConfirmation(`Delete event "${this.event.Name}"?`)
            .then(() => this._eventsService.deleteById(this.event.Id))
            .then(() => this._alertsService.showSuccess(`Deleted "${this.event.Name}" successfully.`))
            .then(() => this._navigate('/events', true))
            .catch(err => err && this._alertsService.showError(err.message));
    }

    register() {
        if (!this.event.EventDate) {
            return this._navigate(`/events/${this.event.Id}/date-selection`, false, { eventObj: this.event });
        }
        
        let promises: Promise<any>[] = [
            this._eventsService.registerForEvent(this.event.Id, [this.event.EventDate]),
            this._groupsService.getById(this.event.GroupId)
        ];

        Promise.all(promises)
            .then(results => {            
                let group: Group = results[1];

                let ctx = {
                    title: 'Hooooray!',
                    text: `Your friends from ${group.Name} will be notified that you are going`,
                    closeTimeout: constants.modalsTimeout
                };

                this._updateInfoOnRegister();
                this._alertsService.showModal(ctx, this._vcRef, AppModalComponent);
            })
            .catch(err => err && this._alertsService.showError(err.message));
        
        // let dateSelectionPromise: Promise<string[]> = null;

        // if (this.event.EventDate) {
        //     dateSelectionPromise = Promise.resolve([this.event.EventDate]);
        // } else {
        //     dateSelectionPromise = this._openDateSelectionModal();
        // }

        // dateSelectionPromise.then(dateChoices => {
        //     if (!dateChoices) { // user closed modal
        //         return Promise.reject(null);
        //     }
        //     let promises: Promise<any>[] = [this._eventsService.registerForEvent(this.event.Id, dateChoices)];
        //     if (this.event.EventDate) {
        //         promises.push(this._groupsService.getById(this.event.GroupId));
        //     }
        //     return Promise.all(promises);
        // })
        // .then(results => {            
        //     let group: Group = results[1];
        //     let text = 'You have successfully registered for this event.';

        //     if (group) {
        //         text = `Your friends from ${group.Name} will be notified that you are going`;
        //     }

        //     let ctx = {
        //         title: 'Hooooray!',
        //         text: text,
        //         closeTimeout: constants.modalsTimeout
        //     };

        //     this._updateInfoOnRegister();
        //     this._alertsService.showModal(ctx, this._vcRef, AppModalComponent);
        // })
        // .catch(err => err && this._alertsService.showError(err.message));
    }

    changeVote() {
        this._navigate(`/events/${this.event.Id}/date-selection`, false, { eventObj: this.event, userReg: this._userRegForThisEvent });
        // let updatedChoices: string[];

        // this._openDateSelectionModal(true)
        //     .then(dateChoices => {
        //         if (!dateChoices) {
        //             return Promise.reject(false); // dont show an error, user closed the modal
        //         }
        //         if (dateChoices.length) {
        //             updatedChoices = dateChoices;
        //             return this._regsService.updateChoices(this.event.Id, this._currentUser.Id, dateChoices);
        //         }
        //     })
        //     .then(() => {
        //         this._updateCountsByDate();
        //         this._userRegForThisEvent.Choices = updatedChoices;
        //         this._alertsService.showSuccess('Vote updated');
        //     })
        //     .catch(err => err && this._alertsService.showError(err.message));
    }

    showLocation() {
        let url = this.event.LocationURL;
        if (!utilities.urlHasProtocol(url)) {
            url = 'http://' + url;
        }
        nsUtils.openUrl(url);
    }

    toggleExpandedUsers() {
        this.registeredUsersExpanded = !this.registeredUsersExpanded;
    }

    onBack() {
        if (this._routerExtensions.canGoBack() && !this.participationChanged) {
            this._routerExtensions.back();
        } else { // simulate going back
            this._navigate('/events', true);
        }
    }

    countsInitialized() {
        return !!this._countByDate;
    }

    getVoteText(date: string) {
        let voteCount = this._countByDate[date] || 0;
        let text = ` - ${voteCount} vote`;
        if (voteCount !== 1) {
            text += 's';
        }
        return text;
    }

    userVotedForDate(date: Date) {
        return !!this._userRegForThisEvent && this._userRegForThisEvent.Choices.some((r: any) => r.toISOString() === date.toISOString());
    }

    onParticipantsTap() {
        this._navigate(`/events/${this.event.Id}/participants`);
    }

    rethinkMode() {
        return this.event && !this.isPastEvent && this.event.RegistrationCompleted;
    }

    canRegister() {
        return this.event && !this.alreadyRegistered && !this.isPastEvent && this._openAndNotComplete();
    }

    canFinalize() {
        return this.canEdit() && !this.event.RegistrationCompleted && !this.event.EventDate;
    }

    canUnregister() {
        return this._reggedAndNotPast() && this._openAndNotComplete();
    }

    canChangeVote() {
        return this._reggedAndNotPast() && !this.event.EventDate && !this.event.RegistrationCompleted;
    }

    rethinkAndGo() {
        return this.rethinkMode() && !this.alreadyRegistered;
    }

    rethinkAndDontGo() {
        return this.rethinkMode() && this.alreadyRegistered;
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

    goFinalize() {
        this._navigate(`events/${this.event.Id}/finalize`);
    }

    toggleActions() {
        action({
            message: 'What would you like to do?',
            actions: this._actions,
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result === 'Change vote') {
                this.changeVote();
            } else if (result === 'I\'m not going') {
                this.unregister();
            } else if (result === 'Delete Event') {
                this.deleteEvent();
            } else if (result === 'I\'m going') {
                this.register();
            } else if (result === 'Set final date') {
                this.goFinalize();
            }
        });
    }

    showIf(shouldShow: boolean) {
        return utilities.showIf(shouldShow);
    }

    getRegisterBtnText() {
        let text: string;
        if (this.event.EventDate) {
            text = 'I\'m going';
        } else {
            text = 'Vote for date';
        }
        return text;
    }

    private _reggedAndNotPast() {
        return this.event && this.alreadyRegistered && !this.isPastEvent;
    }

    private _openAndNotComplete() {
        return this.event && this.event.OpenForRegistration && !this.event.RegistrationCompleted;
    }

    private _setupActions() {
        this._actions = [];
        if (this.canEdit() && !this.event.RegistrationCompleted) {
            this._actions.push('Set final date');
        }

        if (this.rethinkAndGo()) {
            this._actions.push('I\'m going');
        }

        if (this.canChangeVote()) {
            this._actions.push('Change vote');
        }

        if (this.canUnregister() || this.rethinkAndDontGo()) {
            this._actions.push('I\'m not going');
        }

        if (this.canEdit()) {
            this._actions.push('Delete Event');
        }
    }

    private _updateCountsByDate() {
        return this._eventsService.getDateChoicesVotes(this.event.Id)
            .then(result => this._countByDate = result.countByDate);
    }

    // private _openDateSelectionModal(isChangeVote = false) {
    //     let opts: ModalDialogOptions = {
    //         context: {
    //             availableDates: this.event.EventDateChoices
    //         },
    //         fullscreen: true,
    //         viewContainerRef: this._vcRef
    //     };

    //     if (isChangeVote) {
    //         opts.context.title = 'Change vote';
    //         opts.context.buttons = { ok: 'Submit new vote' };
    //     }

    //     return this._modalService.showModal(EventRegistrationModalComponent, opts)
    //         .then((dateChoices: number[]) => {
    //             let result: string[] = null;

    //             if (dateChoices && dateChoices.length) {
    //                 this._dateChoicesMade = [];
    //                 dateChoices.forEach(c => this._dateChoicesMade.push(this.event.EventDateChoices[c]));
    //                 result = this._dateChoicesMade;
    //             }

    //             return Promise.resolve(result);
    //         });
    // }

    private _updateInfoOnRegister() {
        this.participationChanged = true;
        if (this._page.ios) {
            this._hideIosBackBtn();
        }
        this.alreadyRegistered = true;
        this.registeredUsers = this.registeredUsers.concat(this._currentUser);
        this._userRegForThisEvent = this._userRegForThisEvent || ({ Choices: [] } as EventRegistration);
        this._dateChoicesMade.forEach(dc => {
            this._userRegForThisEvent.Choices.push(dc);
        });
        this._updateCountsByDate();
        this._setupActions();
    }

    private _updateInfoOnUnregister() {
        this.participationChanged = true;
        if (this._page.ios) {
            this._hideIosBackBtn();
        }
        this.alreadyRegistered = false;
        this.registeredUsers = this.registeredUsers.filter(u => u.Id !== this._currentUser.Id);
        this._updateCountsByDate();
        this._setupActions();
        this._userRegForThisEvent = null;
    }

    private _hideIosBackBtn() {
        let ctrl = frameModule.topmost().ios.controller;
        ctrl.navigationItem.hidesBackButton = true;
        this._page.ios.navigationItem.hidesBackButton = true;
    }

    private _navigate(toUrl: string, back = false, data?: any) {
        let clearHistory = !!back;
        let transition: { name: string, duration: number, curve: string };
        if (back) {
            transition = utilities.getReversePageTransition();
        } else {
            transition = utilities.getPageTransition();
        }
        let params: any[] = [toUrl];
        let dataToSend = utilities.stringifyValues(data);
        if (dataToSend) {
            params.push(dataToSend);
        }
        this._routerExtensions.navigate(params, { transition, clearHistory });
    }
}
