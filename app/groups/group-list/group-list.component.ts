import { Component, Input, Output, EventEmitter } from '@angular/core';

import { GroupsService } from '../../services';
import { Group } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'group-list',
    templateUrl: 'groups/group-list/group-list.template.html',
    styleUrls: ['groups/group-list/group-list.component.css']
})
export class GroupListComponent {
    @Input() groups: Group[];
    @Output() onGroupTap: EventEmitter<Group> = new EventEmitter<Group>();

    constructor(
        private _groupsService: GroupsService
    ) {}

    groupTap(event: any) {
        let clickedGroup = this.groups[event.index];
        this.onGroupTap.emit(clickedGroup);
    }

    getResizedImageUrl(imageUrl: string) {
        return utilities.getAsResizeUrl(imageUrl, { width: 50, height: 50 });
    }
}
