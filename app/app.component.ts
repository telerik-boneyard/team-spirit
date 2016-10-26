import { Component } from "@angular/core";
import { EverliveProvider, UsersService, EventsService } from './services';

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
    providers: [EverliveProvider, UsersService, EventsService]
})
export class AppComponent {
}
