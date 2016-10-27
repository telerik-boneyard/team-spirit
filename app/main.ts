// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgModule } from "@angular/core";
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';

import { AppComponent } from "./app.component";
import { LoginComponent } from './login/login.component'
import { UserDetailsComponent } from './user-details/user-details.component';
import { UpcomingEventsComponent, EventDetailsComponent } from './events';

const routes = [
    { path: '', redirectTo: 'login', terminal: true, pathMatch: 'full' },
    { path: 'user-details', component: UserDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'events/upcoming', component: UpcomingEventsComponent },
    { path: 'events/:id', component: EventDetailsComponent }
];

@NgModule({
    declarations: [
        SIDEDRAWER_DIRECTIVES,
        AppComponent, 
        LoginComponent,
        UserDetailsComponent,
        UpcomingEventsComponent,
        EventDetailsComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        NativeScriptFormsModule,
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ],
})
class AppComponentModule {
}

platformNativeScriptDynamic().bootstrapModule(AppComponentModule);