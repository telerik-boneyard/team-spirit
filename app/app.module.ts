import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NSModuleFactoryLoader } from "nativescript-angular/router";

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
    PushNotificationsService,
    LoadingIndicatorService
} from './services';

import { SharedModule } from './shared';

@NgModule({
    declarations: [
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
        PushNotificationsService,
        LoadingIndicatorService,
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader },
    ],
    bootstrap: [ AppComponent ],
    imports: [
        SharedModule,
        NativeScriptFormsModule,
        NativeScriptModule,
        AppRoutingModule
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule {}
