import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { GroupsService, AlertService, PlatformService, UsersService } from '../../services';
import { User, Group } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'group-members',
    templateUrl: 'groups/group-members/group-members.template.html',
    styleUrls: ['groups/group-members/group-members.component.css']
})
export class GroupMembersComponent implements OnInit {
    group: Group;
    members: User[];
    isAndroid: boolean = false;
    noAdmin: boolean = false;
    canAdd: boolean = false;

    private _groupId: string;

    constructor(
        private _route: ActivatedRoute,
        private _alertsService: AlertService,
        private _groupsService: GroupsService,
        private _usersService: UsersService,
        private _platform: PlatformService,
        private _routerExtensions: RouterExtensions,
        private _page: Page
    ) {
        this.isAndroid = this._platform.isAndroid;
    }

    ngOnInit() {
        this._route.params.subscribe(p => {
            this._groupId = p['id'];
            let groupPrm = this._groupsService.getById(this._groupId)
                .then(g => {
                    this.group = g;
                    this._page.actionBar.title = 'Members of ' + this.group.Name;
                });
            let membersPrm = this._groupsService.getGroupMembers(this._groupId)
                .then(members => this.members = members.sort((m1, m2) => {
                    return utilities.compareStringsForSort(m1.DisplayName, m2.DisplayName);
                }));

            Promise.all<any>([this._usersService.currentUser(), groupPrm, membersPrm])
                .then((result) => {
                    let currentUser: User = result[0];
                    if (this.group.Owner === currentUser.Id) {
                        this.canAdd = true;
                    }

                    let owner: any = utilities.find(this.members, m => m.Id === this.group.Owner);
                    if (owner) {
                        owner._label = 'administrator';
                    } else {
                        this.noAdmin = true;
                    }
                })
                .catch(err => err && this._alertsService.showError(err.message));
        });
    }

    onAdd() {
        this._alertsService.showError('Member invitations are not implemented yet.');
    }

    onBack() {
        this._routerExtensions.navigateByUrl(`/groups/${this._groupId}`);
    }
}
