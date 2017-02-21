import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
    initialized: boolean = false;
    selectedIndex: number = 0;

    @ViewChild("groupsTabView") groupsTabView: ElementRef;

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
                let index = Number(p['selectedTabIndex']);
                // ngIf on the tab view makes it impossible to toggle it with goToTab()
                // but setting this.selectedIndex doesnt switch tabs after this initial time
                // so we use a mix of both...
                this.selectedIndex = index;
            }
        });

        this._usersService.currentUser()
            .then(u => {
                let unjoinedGroupsPromise = this._groupsService.getUnjoinedGroups(u.Id)
                    .then(res => this.publicGroups = res);
                let userGroupsPromise = this._groupsService.getUserGroups(u.Id)
                    .then(res => this.userGroups = res);
                return Promise.all([unjoinedGroupsPromise, userGroupsPromise]);
            })
            .then(r => this.initialized = true);
    }

    selectGroup(group: Group) {
        this._routerExtensions.navigate([`/groups/${group.Id}`]);
    }

    onAdd() {
        this._routerExtensions.navigateByUrl('/groups/add');
    }

    goToTab(tabIndex: number) {
        this.groupsTabView.nativeElement.selectedIndex = tabIndex;
    }
}
