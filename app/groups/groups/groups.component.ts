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
    publicGroups: Promise<Group[]>;
    userGroups: Promise<Group[]>;
    initialized: boolean = false;

    constructor(
        private _usersService: UsersService,
        private _groupsService: GroupsService,
        private _routerExtensions: RouterExtensions,
        private _alertService: AlertService
    ) {}
    
    ngOnInit() {
        this.publicGroups = this._groupsService.getPublicGroups();
        
        this._usersService.currentUser()
            .then(u => this.userGroups = this._groupsService.getUserGroups(u.Id));
            
        
        Promise.all([this.publicGroups, this.userGroups])
            .then(() => this.initialized = true, () => this.initialized = false);
    }

    selectGroup(group: Group) {
        this._routerExtensions.navigate([`/groups/${group.Id}`]);
    }

    onAdd() {
        this._routerExtensions.navigateByUrl('/groups/add');
    }
}
