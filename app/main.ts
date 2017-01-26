// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgModule } from "@angular/core";
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';

import { AppComponent } from "./app.component";
import { UserDetailsComponent, LoginComponent, EditUserComponent } from './users';

import {
    AppModalComponent,
    DateTimePickerModalComponent,
    ListPickerModalComponent,
    PhotoPickerComponent
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
    EventDateVotesComponent
} from './events';

import {
    GroupsComponent,
    GroupListComponent,
    EditableGroupComponent,
    EditGroupComponent,
    GroupDetailsComponent,
    AddGroupComponent,
    GroupCreationModalComponent,
    GroupEventsComponent
} from './groups';

const routes = [
    { path: '', redirectTo: 'user/login', terminal: true, pathMatch: 'full' },
    
    { path: 'user', component: UserDetailsComponent },
    { path: 'user/edit', component: EditUserComponent },
    { path: 'user/login', component: LoginComponent },

    { path: 'events', component: EventsComponent },
    { path: 'events/add', component: AddEventComponent },
    { path: 'events/:id', component: EventDetailsComponent },
    { path: 'events/:id/edit', component: EditEventComponent },
    { path: 'events/:id/date-choices', component: EventDateVotesComponent },

    { path: 'groups', component: GroupsComponent },
    { path: 'groups/add', component: AddGroupComponent },
    { path: 'groups/:id', component: GroupDetailsComponent },
    { path: 'groups/:id/edit', component: EditGroupComponent },
    { path: 'groups/:id/events', component: GroupEventsComponent }
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
        EventDateVotesComponent,
        GroupCreationModalComponent,
        GroupEventsComponent,
        PhotoPickerComponent
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

platformNativeScriptDynamic().bootstrapModule(AppComponentModule);
