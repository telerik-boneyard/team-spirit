import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { GroupsService, AlertService, UsersService } from '../../services';
import { Group } from '../../shared/models';

@Component({
    selector: 'groups',
    templateUrl: 'groups/groups/groups.template.html',
    styleUrls: ['groups/groups/groups.component.css']
})
export class GroupsComponent implements OnInit {
    @ViewChild("groupsTabView") groupsTabView: ElementRef;

    publicGroups: Group[] = [];
    userGroups: Group[] = [];
    initialized: boolean = false;
    selectedIndex: number = 0;
    hasMoreUnjoined: boolean = true;
    hasMoreUserGroups: boolean = true;
    private _userId: string;
    private _pageSize = 5;
    private _unjoinedPage = 0;
    private _userGroupsPage = 0;

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
            if ('selectedTabIndex' in p) {
                this.goToTab(Number(p['selectedTabIndex']));
            }
        });

        this._usersService.currentUser()
            .then(u => {
                this._userId = u.Id;
                let unjoinedGroupsPromise = this.loadMoresUnjoinedGroups();
                let userGroupsPromise = this.loadMoresUserGroups();
                return Promise.all([unjoinedGroupsPromise, userGroupsPromise]);
            })
            .then(r => this.initialized = true)
            .catch(err => err && this._alertService.showError(err.message));
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
                console.log(`usr page: ${this._userGroupsPage}`);
        return this._groupsService.getUserGroups(this._userId, this._userGroupsPage, this._pageSize)
            .then(groups => {
                this.userGroups = this.userGroups.concat(groups);
                this.hasMoreUserGroups = this._hasMore(groups.length, this._pageSize);
                if (this.hasMoreUserGroups) {
                    this._userGroupsPage++;
                }
                console.log(`loaded usr: ${groups.length}`);
            })
            .catch(err => this.hasMoreUserGroups = true);
    }

    loadMoresUnjoinedGroups() {
        this.hasMoreUnjoined = false;
                console.log(`unj page: ${this._unjoinedPage}`);
        return this._groupsService.getUnjoinedGroups(this._userId, this._unjoinedPage, this._pageSize)
            .then(groups => {
                this.publicGroups = this.publicGroups.concat(groups);
                this.hasMoreUnjoined = this._hasMore(groups.length, this._pageSize);
                if (this.hasMoreUnjoined) {
                    this._unjoinedPage++;
                }
                console.log(`loaded unj: ${groups.length}`);
            })
            .catch(err => this.hasMoreUnjoined = true);
    }

    private _hasMore(receivedCount: number, pageSize: number) {
        return receivedCount === pageSize;
    }
}
