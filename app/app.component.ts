import { Component, OnInit, ViewChild } from "@angular/core";
import { EverliveProvider, UsersService, EventsService, EventRegistrationsService } from './services';
import { RouterExtensions } from 'nativescript-angular/router'
import { Observable } from 'rxjs/Observable';
import { RadSideDrawer } from 'nativescript-telerik-ui/sidedrawer'

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
    providers: [EverliveProvider, UsersService, EventsService, EventRegistrationsService]
})
export class AppComponent implements OnInit {
    private loggedIn: boolean = false;

    constructor(
        private usersService: UsersService,
        private routerExtensions: RouterExtensions
    ) {}

    ngOnInit() {
        this.usersService.loggedIn().subscribe(logged => {
            if (logged) {
                this.routerExtensions.navigate(['events/upcoming']);
            }

            this.loggedIn = logged;
        });
    }

    logout() {
        this.usersService.logout();
        this.loggedIn = false;
        //TODO: Stop drawer from showing and close it
        this.routerExtensions.navigate(['login']);
    }
}
