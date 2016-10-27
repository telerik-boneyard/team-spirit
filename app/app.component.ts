import { Component } from "@angular/core";
import { EverliveProvider } from './services';
import { UsersService } from './services';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
    providers: [EverliveProvider, UsersService]
})
export class AppComponent {}
