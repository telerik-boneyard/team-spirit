import { Component, Input, OnInit } from '@angular/core';

import { User } from '../models';
import { utilities, constants } from '../';

@Component({
    selector: 'user-list',
    templateUrl: 'shared/user-list/user-list.template.html',
    styleUrls: [ 'shared/user-list/user-list.component.css' ]
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
