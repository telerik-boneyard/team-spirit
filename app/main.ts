// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgModule, enableProdMode } from "@angular/core";
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';

import { AppComponent } from "./app.component";
import { UserDetailsComponent, LoginComponent, EditUserComponent } from './users';
import { SettingsComponent } from './settings';

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

const routes = [
    { path: '', redirectTo: 'user/login', terminal: true, pathMatch: 'full' },
    { path: 'settings', component: SettingsComponent },
    
    { path: 'user', component: UserDetailsComponent },
    { path: 'user/edit', component: EditUserComponent },
    { path: 'user/login', component: LoginComponent },

    { path: 'events', component: EventsComponent },
    { path: 'events/add', component: AddEventComponent },
    { path: 'events/:id', component: EventDetailsComponent },
    { path: 'events/:id/edit', component: EditEventComponent },
    { path: 'events/:id/participants', component: EventParticipantsComponent },

    { path: 'groups', component: GroupsComponent },
    { path: 'groups/add', component: AddGroupComponent },
    { path: 'groups/:id', component: GroupDetailsComponent },
    { path: 'groups/:id/edit', component: EditGroupComponent },
    { path: 'groups/:id/events', component: GroupEventsComponent },
    { path: 'groups/:id/members', component: GroupMembersComponent }
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
        SettingsComponent
    ],
    entryComponents: [
        EventRegistrationModalComponent,
        ListPickerModalComponent,
        DateTimePickerModalComponent,
        EventCreationModalComponent,
        GroupCreationModalComponent,
        AppModalComponent
    ],
    bootstrap: [AppComponent],
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
