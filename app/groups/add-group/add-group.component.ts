import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';

import { GroupCreationModalComponent } from '../group-creation-modal/group-creation-modal.component';
import { GroupsService, AlertService, FilesService, PlatformService } from '../../services';
import { Group } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'add-group',
    templateUrl: './add-group.template.html',
    styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent {
    group: Group;
    isAndroid: boolean = false;

    constructor(
        private _routerExtensions: RouterExtensions,
        private _filesService: FilesService,
        private _groupsService: GroupsService,
        private _alertService: AlertService,
        private _platform: PlatformService,
        private _vsRef: ViewContainerRef,
        private _page: Page
    ) {
        this.group = new Group();
        this.isAndroid = this._platform.isAndroid;
    }

    ngOnInit() {
        this._page.actionBar.title = 'New Group';
    }

    onCreate() {
        let errMsg = this._groupsService.validateGroupEntry(this.group);
        if (errMsg) {
            return this._alertService.showError(errMsg);
        }
        let createdId: string;

        this._alertService.askConfirmation(`Create group "${this.group.Name}"?`)
            .then(() => {
                let promise: Promise<{ Id: string, Uri: string }> = Promise.resolve();

                if (utilities.isLocalFileUrl(this.group.ImageUrl)) {
                    promise = this._filesService.uploadFromUri(this.group.ImageUrl);
                }
                return promise;
            })
            .then((uploadResult) => {
                if (uploadResult) {
                    this.group.Image = uploadResult.Id;
                }
                return this._groupsService.create(this.group);
            })
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
                this._routerExtensions.navigate([`/groups/${createdId}`], { clearHistory: true });
            })
            .catch(err => {
                if (err) {
                    if (err.code === 107) {
                        err.message = 'A group with this name already exists. Please use a different name';
                    }
                    this._alertService.showError(err.message);
                }
            });
    }

    onCancel() {
        this._routerExtensions.back();
    }
}
