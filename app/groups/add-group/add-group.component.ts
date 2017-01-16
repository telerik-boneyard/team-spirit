import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { GroupCreationModalComponent } from '../group-creation-modal/group-creation-modal.component';
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
        private _routerExtensions: RouterExtensions,
        private _groupsService: GroupsService,
        private _alertService: AlertService,
        private _vsRef: ViewContainerRef
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
                let ctx = { groupName: this.group.Name };
                return this._alertService.showModal(ctx, this._vsRef, GroupCreationModalComponent);
            })
            .then((doInviteMembers: boolean) => {
                if (doInviteMembers) {
                    return this._alertService.showError('Not implemented, yet');
                }
                
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
