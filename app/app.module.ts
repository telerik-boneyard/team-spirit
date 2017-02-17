import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';
import { NgModule } from "@angular/core";
import { Router } from "@angular/router";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from './app-routing.module';

import {
    EverliveProvider,
    UsersService,
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
        AppComponent
    ],
    providers: [
        EverliveProvider,
        UsersService,
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
        AppRoutingModule
    ]
})
export class AppModule {}
