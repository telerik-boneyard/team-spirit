import { Component, Input, OnInit } from '@angular/core';

import { User } from '../models';

@Component({
    selector: 'user-display',
    templateUrl: 'shared/user-display/user-display.template.html',
    styleUrls: [ 'shared/user-display/user-display.component.css' ]
})
export class UserDisplayComponent implements OnInit {
    @Input() users: User[] = [];
    @Input('withImages') imgCount: number = null;
    @Input() showNames: boolean = false;

    ngOnInit() {
        this.users = [].concat(this.users);
        if (typeof this.imgCount !== 'number') {
            this.imgCount = this.users.length;
        }
    }

    showImage(userIndex: number) {
        return userIndex < this.imgCount;
    }

    hasRemainingLabel() {
        return this.users.length > this.imgCount;
    }

    getRemainingText() {
        let remainingCount = this.users.length - this.imgCount;
        return ` and ${remainingCount} more`;
    }
}
