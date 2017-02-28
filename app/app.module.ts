import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptUISideDrawerModule, SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';
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

// import { EventsModule } from './events';
// import { GroupsModule } from './groups';
// import { UsersModule } from './users';
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
        SIDEDRAWER_DIRECTIVES,
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader },
    ],
    // entryComponents: [ AppModalComponent ],
    bootstrap: [ AppComponent ],
    imports: [
        SharedModule,
        NativeScriptUISideDrawerModule,
        NativeScriptFormsModule,
        NativeScriptModule,
        AppRoutingModule
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule {}
