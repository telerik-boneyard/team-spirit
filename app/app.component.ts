import { Component, OnInit, ViewChild } from "@angular/core";
import { EverliveProvider, UsersService, EventsService, EventRegistrationsService } from './services';
import { RouterExtensions } from 'nativescript-angular/router'
import { RadSideDrawerComponent } from 'nativescript-telerik-ui/sidedrawer/angular'

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
    providers: [EverliveProvider, UsersService, EventsService, EventRegistrationsService]
})
export class AppComponent implements OnInit {
    private loggedIn: boolean = false;
    @ViewChild('drawer') drawer: RadSideDrawerComponent;

    constructor(
        private usersService: UsersService,
        private routerExtensions: RouterExtensions
    ) { }

    ngOnInit() {
        this.usersService.loggedIn().subscribe(logged => {
            if (logged) {
                this.routerExtensions.navigate(['events']);
            }

            this.loggedIn = logged;
        });
    }

    closeDrawer() {
        this.drawer.sideDrawer.closeDrawer();
    }

    openDrawer() {
        this.drawer.sideDrawer.showDrawer();
    }

    toggleDrawer() {
        if (this.drawer.sideDrawer.getIsOpen()) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }

    logout() {
        this.usersService.logout();
        this.loggedIn = false;
        //TODO: Stop drawer from showing and close it
        this.routerExtensions.navigate(['login']);
    }
}
