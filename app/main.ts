// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgModule, enableProdMode } from "@angular/core";
import { Routes } from "@angular/router";
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';

import { AppComponent } from "./app.component";
import { UserDetailsComponent, LoginComponent, EditUserComponent, PasswordResetModalComponent } from './users';
import { SettingsComponent } from './settings';
import { EverliveProvider, UsersService, AuthGuardService } from './services';

import {
    AppModalComponent,
    DateTimePickerModalComponent,
    ListPickerModalComponent,
    PhotoPickerComponent,
    UserDisplayComponent,
    UsersListComponent
} from './shared';

import { 
    EventsComponent,
    EventDetailsComponent,
    EventRegistrationModalComponent,
    EventCreationModalComponent,
    EventListComponent,
    AddEventComponent,
    EditableEventComponent,
    EditEventComponent,
    EventParticipantsComponent
} from './events';

import {
    GroupsComponent,
    GroupListComponent,
    EditableGroupComponent,
    EditGroupComponent,
    GroupDetailsComponent,
    AddGroupComponent,
    GroupCreationModalComponent,
    GroupEventsComponent,
    GroupMembersComponent
} from './groups';

const routes: Routes = [
    { path: '', redirectTo: 'events', pathMatch: 'full' },
    { path: 'settings', canActivate: [ AuthGuardService ], component: SettingsComponent },
    
    { path: 'user/login', component: LoginComponent },
    { path: 'user/edit', canActivate: [ AuthGuardService ], component: EditUserComponent },
    { path: 'user', canActivate: [ AuthGuardService ], component: UserDetailsComponent },

    { path: 'events', canActivate: [ AuthGuardService ], children: [
            { path: '', component: EventsComponent },
            { path: 'add', component: AddEventComponent },
            { path: ':id', component: EventDetailsComponent },
            { path: ':id/edit', component: EditEventComponent },
            { path: ':id/participants', component: EventParticipantsComponent },
        ]
    },

    { path: 'groups', canActivate: [ AuthGuardService ], children: [
            { path: '', component: GroupsComponent },
            { path: 'add', component: AddGroupComponent },
            { path: ':id', component: GroupDetailsComponent },
            { path: ':id/edit', component: EditGroupComponent },
            { path: ':id/events', component: GroupEventsComponent },
            { path: ':id/members', component: GroupMembersComponent }
        ]
    }
];

@NgModule({
    declarations: [
        SIDEDRAWER_DIRECTIVES,
        AppComponent, 
        LoginComponent,
        UserDetailsComponent,
        EventsComponent,
        EventDetailsComponent,
        EventRegistrationModalComponent,
        EventListComponent,
        AddEventComponent,
        EditableEventComponent,
        EditEventComponent,
        GroupsComponent,
        GroupListComponent,
        EditableGroupComponent,
        EditGroupComponent,
        GroupDetailsComponent,
        AddGroupComponent,
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
        NativeScriptRouterModule.forRoot(routes)
    ]
})
class AppComponentModule {
}

enableProdMode();
platformNativeScriptDynamic().bootstrapModule(AppComponentModule);
