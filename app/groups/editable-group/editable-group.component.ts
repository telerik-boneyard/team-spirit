import { Component, Input, OnInit, ViewContainerRef, Type } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { ListPickerModalComponent } from '../../shared';
import { GroupsService, UsersService } from '../../services';
import { Group, User } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'editable-group',
    templateUrl: 'groups/editable-group/editable-group.template.html',
    styleUrls: ['groups/editable-group/editable-group.component.css']
})
export class EditableGroupComponent implements OnInit {
    currentUser: User;
    @Input() group: Group;

    private _groupTypeOptions = [ 'Public', 'Private' ];
    private _groupApprovalOptions = [ 'Approval is required', 'Approval not required' ];

    constructor(
        private _modalService: ModalDialogService,
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

    getUserResizedUrl(rawUrl: string) {
        return this._getResizedImageUrl(rawUrl, { width: 60, height: 60 });
    }

    getGroupResizedUrl(rawUrl: string) {
        return this._getResizedImageUrl(rawUrl);
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
        let opts: ModalDialogOptions = {
            context: ctx,
            fullscreen: true,
            viewContainerRef: this._vcRef
        };

        return this._modalService.showModal(ListPickerModalComponent, opts)
            .then(result => (result !== undefined) ? result : Promise.reject(null));
    }

    private _getResizedImageUrl(rawUrl: string, dims?) {
        return utilities.getAsResizeUrl(rawUrl, dims);
    }
}
