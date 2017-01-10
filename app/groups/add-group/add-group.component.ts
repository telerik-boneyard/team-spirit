import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { GroupsService, AlertService } from '../../services';
import { Group } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'add-group',
    templateUrl: 'groups/add-group/add-group.template.html',
    styleUrls: ['groups/add-group/add-group.component.css']
})
export class AddGroupComponent {
    group: Group;

    constructor(
        private _alertService: AlertService,
        private _routerExtensions: RouterExtensions,
        private _groupsService: GroupsService
    ) {
        this.group = new Group();
    }
    
    onCreate() {
        let errMsg = this._groupsService.validateGroupEntry(this.group);
        if (errMsg) {
            return this._alertService.showError(errMsg);
        }
        let createdId: string;
        this._groupsService.create(this.group)
            .then((result) => {
                createdId = result.Id;
                return this._alertService.showSuccess(`Group "${this.group.Name}" created!`);
            })
            .then(() => {
                this._routerExtensions.navigateByUrl(`/groups/${createdId}`);
            })
            .catch(err => {
                if (err) {
                    this._alertService.showError(err.message);
                }
            });
    }
}
