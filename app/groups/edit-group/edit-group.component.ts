import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { GroupsService, AlertService, FilesService, PlatformService } from '../../services';
import { Group } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'edit-group',
    templateUrl: 'groups/edit-group/edit-group.template.html',
    styleUrls: ['groups/edit-group/edit-group.component.css']
})
export class EditGroupComponent implements OnInit {
    group: Group;
    isAndroid: boolean = false;

    constructor(
        private _groupsService: GroupsService,
        private _alertsService: AlertService,
        private _filesService: FilesService,
        private _routerExtensions: RouterExtensions,
        private _platform: PlatformService,
        private _activatedRoute: ActivatedRoute
    ) {
        this.isAndroid = this._platform.isAndroid;
    }

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

    save() {
        let validationErr = this._groupsService.validateGroupEntry(this.group);
        if (validationErr) {
            return this._alertsService.showError(validationErr);
        }
        
        this._alertsService.askConfirmation(`Update all fields of "${this.group.Name}"?`)
            .then(() => {
                let prm = Promise.resolve<{ Id: string, Uri: string }>();

                if (utilities.isLocalUrl(this.group.ImageUrl)) {
                    prm = this._filesService.uploadFromUri(this.group.ImageUrl);
                }

                return prm;
            })
            .then((uploadResult) => {
                if (uploadResult) {
                    this.group.Image = uploadResult.Id;
                }
                return this._groupsService.update(this.group);
            })
            .then(() => {
                return this._alertsService.showSuccess(`Group "${this.group.Name}" updated!`);
            })
            .then(() => {
                this._routerExtensions.navigate([`/groups/${this.group.Id}`]);
            })
            .catch(err => {
                if (err) {
                    this._alertsService.showError(err.message);
                }
            });
    }

    delete() {
        this._alertsService.askConfirmation(`Delete "${this.group.Name}"?`)
            .then(() => {
                return this._groupsService.delete(this.group.Id);
            })
            .then(() => {
                return this._alertsService.showSuccess(`Group "${this.group.Name}" deleted!`);
            })
            .then(() => {
                this._routerExtensions.navigate(['/groups']);
            })
            .catch(err => {
                if (err) {
                    this._alertsService.showError(err.message);
                }
            });
    }

    onCancel() {
        this._routerExtensions.back();
    }
}
