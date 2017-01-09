import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GroupsService, AlertService } from '../../services';
import { Group } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'group-details',
    templateUrl: 'groups/group-details/group-details.template.html',
    styleUrls: ['groups/group-details/group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
    group: Group;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _alertsService: AlertService,
        private _groupsService: GroupsService
    ) {}

    ngOnInit() {
        this._activatedRoute.params.subscribe(p => {
            this._groupsService.getById(p['id'])
                .then(group => {
                    this.group = group;
                }, (err) => {
                    this._alertsService.showError(err.message);
                });
        });
    }
}