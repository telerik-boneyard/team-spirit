import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { SettingsComponent } from './settings';
import { appRoutes } from './app.routing';

import {
    EverliveProvider,
    UsersService,
    AuthGuard,
    PlatformService,
    AlertService,
    EventRegistrationsService,
    EventsService,
    FilesService,
    GroupsService,
    ImagePickerService,
    PushNotificationsService
} from './services';

import { EventsModule } from './events';
import { GroupsModule } from './groups';
import { UsersModule } from './users';
import { SharedModule } from './shared';

@NgModule({
    declarations: [
        SIDEDRAWER_DIRECTIVES,
        AppComponent,
        SettingsComponent
    ],
    providers: [
        EverliveProvider,
        UsersService,
        AuthGuard,
        PlatformService,
        AlertService,
        EventRegistrationsService,
        EventsService,
        FilesService,
        GroupsService,
        ImagePickerService,
        PushNotificationsService
    ],
    bootstrap: [ AppComponent ],
    imports: [
        NativeScriptFormsModule,
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(appRoutes),
        EventsModule,
        GroupsModule,
        UsersModule,
        SharedModule
    ]
})
export class AppModule {}

