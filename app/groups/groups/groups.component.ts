import { Component, OnInit } from '@angular/core';
// import { RouterExtensions } from 'nativescript-angular/router';
// import { Page } from 'ui/page';

import { GroupsService, AlertService } from '../../services';
import { Group } from '../../shared/models';
// import { utilities } from '../../shared';

@Component({
    selector: 'groups',
    templateUrl: 'groups/groups/groups.template.html',
    styleUrls: ['groups/groups/groups.component.css']
})
export class GroupsComponent implements OnInit {
    groups: Group[];

    constructor(
        private _groupsService: GroupsService,
        private _alertService: AlertService
    ) {}
    
    ngOnInit() {
        this._groupsService.getNonPrivate().then(groups => {
            this.groups = groups;
        })
        .catch((err) => {
            this._alertService.showError(err.message);
        });
    }

    selectGroup(group: Group) {
        console.log('selected group: ' + JSON.stringify(group));
    }
}
