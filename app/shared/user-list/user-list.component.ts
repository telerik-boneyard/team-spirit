import { Component, Input, OnInit } from '@angular/core';

import { User } from '../models';
import { utilities, constants } from '../';

@Component({
    moduleId: module.id,
    selector: 'user-list',
    templateUrl: './user-list.template.html',
    styleUrls: [ './user-list.component.css' ]
})
export class UsersListComponent implements OnInit {
    @Input() users: User[] = [];

    ngOnInit() {
        // console.log(`user list: ${JSON.stringify(this.users)}`);
    }

    getUserLabel(user: any) {
        return `(${user._label})`;
    }
}
