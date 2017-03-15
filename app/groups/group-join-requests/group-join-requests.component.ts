import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'ui/page';
import * as frameModule from 'ui/frame';

import { EventsService, GroupsService, AlertService, PlatformService } from '../../services';
import { GroupJoinRequest } from '../../shared/models';
import { utilities, AndroidBackOverrider } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'group-join-requests',
    templateUrl: './group-join-requests.template.html',
    styleUrls: ['./group-join-requests.component.css']
})
export class GroupJoinRequestsComponent extends AndroidBackOverrider implements OnInit {
    requests: GroupJoinRequest[];
    isAndroid: boolean = false;
    hasApprovedSome: boolean = false;
    private _groupId: string;
    private _currPage: number = 0;
    private _pageSize: number = 10;
    private _totalCount: number = null;
    private _lockLoadMore: boolean = false;
    private _lockedRequests: { [requestId: string]: boolean } = {};

    constructor(
        private _page: Page,
        private _route: ActivatedRoute,
        private _platform: PlatformService,
        private _alertsService: AlertService,
        private _groupsService: GroupsService,
        private _routerExtensions: RouterExtensions,
        private _changeDetectionRef: ChangeDetectorRef
    ) {
        super(_page, _platform.isAndroid);
        this.isAndroid = this._platform.isAndroid;
    }
    
    ngOnInit() {
        this._page.actionBar.title = 'Requests';
        this._route.params.subscribe(p => {
            this._groupId = p['id'];
            this._groupsService.getUnresolvedRequestsCount(this._groupId)
                .then((count: any) => this._totalCount = count)
                .catch(err => err && this._alertsService.showError(err.message));
            
            this._loadRequests();
        });
    }

    onBack() {
        if (this.hasApprovedSome) {
            let clearHistory = this.hasApprovedSome;
            let transition = utilities.getReversePageTransition();
            this._routerExtensions.navigate([`/groups/${this._groupId}`], { transition, clearHistory });
        } else {
            this._routerExtensions.back();
        }
    }

    hasMore() {
        return this._totalCount > 0 && this.requests.length < this._totalCount; // null > 0 is false
    }

    onLoadMore() {
        this._loadRequests();
    }

    getTimeSinceCreation(creationDate: Date) {
        return `(${utilities.getRelativeTimeText(creationDate)})`;
    }

    resolve(request: GroupJoinRequest, approve: boolean) {
        if (this._lockedRequests[request.Id]) {
            return;
        }
        this._lockedRequests[request.Id] = true;
        this._groupsService.resolveJoinRequest(request.Id, approve)
            .then((resp) => {
                request.Approved = approve;
                request.Resolved = true;
                this.hasApprovedSome = true;
                if (this._platform.isIos) {
                    this._hideIosBackBtn();
                }
                this._lockedRequests[request.Id] = false;
            })
            .catch(err => {
                if (err) {
                    this._alertsService.showError(err.message);
                }
                this._lockedRequests[request.Id] = false;
            });
    }

    getApprovalText(request: GroupJoinRequest) {
        let text = request.Approved ? 'Approved' : 'Denied';
        return text;
    }

    private _loadRequests() {
        if (this._lockLoadMore) {
            return;
        }
        this._lockLoadMore = true;
        return this._groupsService.getRequests(this._groupId, this._currPage, this._pageSize)
            .then(requests => {
                this.requests = (this.requests || []).concat(requests);
                this._currPage++;
                this._lockLoadMore = false;
            })
            .catch(err => {
                if (err) {
                    this._alertsService.showError(err.message);
                }
                this._lockLoadMore = false;
            });
    }

    private _hideIosBackBtn() {
        let ctrl = frameModule.topmost().ios.controller;
        ctrl.navigationItem.hidesBackButton = true;
        this._page.ios.navigationItem.hidesBackButton = true;
    }
}
