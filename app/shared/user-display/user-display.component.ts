import { Component, Input, OnInit } from '@angular/core';

import { User } from '../models';

@Component({
    moduleId: module.id,
    selector: 'user-display',
    templateUrl: './user-display.template.html',
    styleUrls: [ './user-display.component.css' ]
})
export class UserDisplayComponent implements OnInit {
    private _users: User[] = [];
    
    @Input('withImages') imgCount: number = null;
    @Input() showNames: boolean = false;

    @Input() set users(newValue: User[]) {
        this._users = [].concat(newValue);
    }

    get users() {
        return this._users;
    }

    ngOnInit() {
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

    shouldShowNames() {
        return this.showNames || this.users.length === 1;
    }
}
