import { Component, OnInit } from '@angular/core';
import { User } from '../shared';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'user-details',
    templateUrl: 'user-details/user-details.template.html'
})
export class UserDetailsComponent implements OnInit {
    private user: User;

    constructor(
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.user = this.route.snapshot.data['user'];
    }
}