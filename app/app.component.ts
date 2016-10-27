import { Component, OnInit } from "@angular/core";
import { EverliveProvider, UsersService, EventsService } from './services';
import { RouterExtensions } from 'nativescript-angular/router'
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
    providers: [EverliveProvider, UsersService, EventsService]
})
export class AppComponent implements OnInit {
    private loggedIn: Observable<boolean>;

    constructor(
        private usersService: UsersService,
        private routerExtensions: RouterExtensions
    ) {
        this.loggedIn = this.usersService.loggedIn();         
    }

    ngOnInit() {
        this.loggedIn.subscribe(logged => {
            if (logged) {
                this.routerExtensions.navigate(['upcoming-events']);
            }
        })
    }

    logout() {
        this.usersService.logout();
        this.routerExtensions.navigate(['login']);
    }
}
