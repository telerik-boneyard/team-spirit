import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

import { GroupsService, AlertService, UsersService } from '../../services';
import { Group } from '../../shared/models';

@Component({
    selector: 'groups',
    templateUrl: 'groups/groups/groups.template.html',
    styleUrls: ['groups/groups/groups.component.css']
})
export class GroupsComponent implements OnInit {
    groups: Group[];

    constructor(
        private _usersService: UsersService,
        private _groupsService: GroupsService,
        private _routerExtensions: RouterExtensions,
        private _alertService: AlertService
    ) {}
    
    ngOnInit() {
        this._usersService.currentUser()
            .then(user => {
                return this._groupsService.getAllVisible(user.Id);
            })
            .then(groups => {
                this.groups = groups;
            })
            .catch((err) => {
                this._alertService.showError(err.message);
            });
    }

    selectGroup(group: Group) {
        this._routerExtensions.navigate([`/groups/${group.Id}`]);
    }

    onAdd() {
        this._routerExtensions.navigateByUrl('/groups/add');
    }
}
