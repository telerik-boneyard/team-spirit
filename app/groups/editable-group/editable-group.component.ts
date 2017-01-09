import { Component, Input } from '@angular/core';

import { GroupsService } from '../../services';
import { Group } from '../../shared/models';
import { utilities } from '../../shared';

@Component({
    selector: 'editable-group',
    templateUrl: 'groups/editable-group/editable-group.template.html',
    styleUrls: ['groups/editable-group/editable-group.component.css']
})
export class EditableGroupComponent {
    @Input() group: Group;

    constructor(
        
    ) {}
}
