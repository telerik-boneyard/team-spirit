import { Component, Input, OnInit, ViewContainerRef, Type } from '@angular/core';

import { ListPickerModalComponent } from '../../shared';
import { GroupsService, UsersService, AlertService } from '../../services';
import { Group, User } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'editable-group',
    templateUrl: './editable-group.template.html',
    styleUrls: ['./editable-group.component.css']
})
export class EditableGroupComponent implements OnInit {
    currentUser: User;
    @Input() group: Group;

    private _groupTypeOptions = [ 'Public', 'Private' ];
    private _groupApprovalOptions = [ 'Approval is required', 'Approval not required' ];

    constructor(
        private _alertsService: AlertService,
        private _usersService: UsersService,
        private _vcRef: ViewContainerRef
    ) {}

    ngOnInit() {
        this._usersService.currentUser().then(u => this.currentUser = u);
    }

    getGroupType(isPublic: boolean) {
        return this._groupTypeOptions[Number(!isPublic)];
    }

    getApprovalType(requiresApproval: boolean) {
        return this._groupApprovalOptions[Number(!requiresApproval)];
    }

    onSelectType() {
        this._openGroupTypeModal().then((selectedIndex: number) => {
            if (selectedIndex > -1) {
                this.group.IsPublic = !selectedIndex; // 0 means public, 1 means private
            }
        }, err => err); // ignore rejection (when user clicks back and closes));
    }

    onSelectApproval() {
        this._openApprovalModal().then((selectedIndex: number) => {
            if (selectedIndex > -1) {
                this.group.RequiresApproval = !selectedIndex; // 0 means requires, 1 means does not
            }
        }, err => err); // ignore rejection (when user clicks back and closes));
    }

    private _openGroupTypeModal() {
        let ctx = {
            items: this._groupTypeOptions,
            selectedIndex: this.group.IsPublic ? 0 : 1
        };
        return this._openModal(ctx);
    }

    private _openApprovalModal() {
        let ctx = {
            items: this._groupApprovalOptions,
            selectedIndex: this.group.RequiresApproval ? 0 : 1
        };
        return this._openModal(ctx);
    }

    private _openModal(ctx: any) {
        return this._alertsService.showModal(ctx, this._vcRef, ListPickerModalComponent);
    }

    private _getResizedImageUrl(rawUrl: string, dims?) {
        return utilities.getAsResizeUrl(rawUrl, dims);
    }
}
