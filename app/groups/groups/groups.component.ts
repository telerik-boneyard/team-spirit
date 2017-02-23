import { Component, OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { GroupsService, AlertService, UsersService } from '../../services';
import { Group } from '../../shared/models';

@Component({
    moduleId: module.id,
    selector: 'groups',
    templateUrl: './groups.template.html',
    styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
    publicGroups: Group[];
    userGroups: Group[];
    hasMoreUnjoined: boolean = true;
    hasMoreUserGroups: boolean = true;
    private readonly _pageSize = 5;
    private _unjoinedPage = 0;
    private _userGroupsPage = 0;
    private _selectedIndex = 0;

    constructor(
        private _page: Page,
        private _route: ActivatedRoute,
        private _usersService: UsersService,
        private _groupsService: GroupsService,
        private _routerExtensions: RouterExtensions,
        private _alertService: AlertService
    ) {}

    ngOnInit() {
        this._page.actionBar.title = 'Groups';
        this._route.params.subscribe(p => {
            let setTabOnInit = 'selectedTabIndex' in p;
            let tabIndex = 0;
            if (setTabOnInit) {
                tabIndex = Number(p['selectedTabIndex']);
            }
            this.goToTab(tabIndex);
        });
    }

    set selectedIndex(val: number) {
        this._selectedIndex = val;
        if (this._selectedIndex === 0 && !this.userGroups) { // user groups open
            this._initialize(true);
        } else if (this._selectedIndex === 1 && !this.publicGroups) { // all groups open
            this._initialize(false);
        }
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    isInitialized() {
        return this.userGroups || this.publicGroups;
    }

    hasAnyGroups() {
        return (this.userGroups && this.userGroups.length) || (this.publicGroups && this.publicGroups.length);
    }

    selectGroup(group: Group) {
        this._routerExtensions.navigate([`/groups/${group.Id}`]);
    }

    onAdd() {
        this._routerExtensions.navigateByUrl('/groups/add');
    }

    goToTab(tabIndex: number) {
        this.selectedIndex = tabIndex;
    }

    loadMoresUserGroups() {
        this.hasMoreUserGroups = false;
        return this._usersService.currentUser()
            .then((u) => this._groupsService.getUserGroups(u.Id, this._userGroupsPage, this._pageSize))
            .then(groups => {
                this.userGroups = (this.userGroups || []).concat(groups);
                this.hasMoreUserGroups = this._hasMore(groups.length, this._pageSize);
                if (this.hasMoreUserGroups) {
                    this._userGroupsPage++;
                }
            })
            .catch(err => this.hasMoreUserGroups = true);
    }

    loadMoresUnjoinedGroups() {
        this.hasMoreUnjoined = false;
        return this._usersService.currentUser()
            .then((u) => this._groupsService.getUnjoinedGroups(u.Id, this._unjoinedPage, this._pageSize))
            .then(groups => {
                this.publicGroups = (this.publicGroups || []).concat(groups);
                this.hasMoreUnjoined = this._hasMore(groups.length, this._pageSize);
                if (this.hasMoreUnjoined) {
                    this._unjoinedPage++;
                }
            })
            .catch(err => this.hasMoreUnjoined = true);
    }

    private _hasMore(receivedCount: number, pageSize: number) {
        return receivedCount === pageSize;
    }

    private _initialize(loadUserGroups) {
        let promise: Promise<any>;
        if (loadUserGroups) {
            promise = this.loadMoresUserGroups();
        } else {
            promise = this.loadMoresUnjoinedGroups();
        }
        return promise.catch(err => err && this._alertService.showError(err.message));
    }
}
