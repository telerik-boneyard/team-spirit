import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

import { appRoutes } from './app.routing';

import {
    AppModalComponent,
    DateTimePickerModalComponent,
    ListPickerModalComponent,
    PhotoPickerComponent,
    UserDisplayComponent,
    UsersListComponent
} from './shared';




// new stuff
import { EventsModule } from './events';
import { GroupsModule } from './groups';
// import { UsersModule } from './users';



@NgModule({
    declarations: [
        SIDEDRAWER_DIRECTIVES,
        AppComponent,
        LoginComponent,
        UserDetailsComponent,
        EditUserComponent,
        AppModalComponent,
        ListPickerModalComponent,
        DateTimePickerModalComponent,
        EventCreationModalComponent,
        GroupCreationModalComponent,
        GroupEventsComponent,
        PhotoPickerComponent,
        UserDisplayComponent,
        UsersListComponent,
        GroupMembersComponent,
        EventParticipantsComponent,
        SettingsComponent,
        PasswordResetModalComponent
    ],
    entryComponents: [
        EventRegistrationModalComponent,
        PasswordResetModalComponent,
        DateTimePickerModalComponent,
        EventCreationModalComponent,
        GroupCreationModalComponent,
        ListPickerModalComponent,
        AppModalComponent
    ],
    providers: [ EverliveProvider, UsersService, AuthGuardService ],
    bootstrap: [ AppComponent ],
    imports: [
        NativeScriptFormsModule,
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(appRoutes),
        EventsModule
    ]
})
export class AppModule {}
