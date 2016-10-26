// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { LoginComponent } from './login/login.component';
import { UpcomingEventsComponent } from './events';

const routes = [
    { path: '', redirectTo: 'login', terminal: true, pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'upcoming-events', component: UpcomingEventsComponent }
];

@NgModule({
    declarations: [AppComponent, LoginComponent, UpcomingEventsComponent],
    bootstrap: [AppComponent],
    imports: [
        NativeScriptFormsModule,
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ],
})
class AppComponentModule {}

platformNativeScriptDynamic().bootstrapModule(AppComponentModule);