// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgModule } from "@angular/core";
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';

import { AppComponent } from "./app.component";
import { LoginComponent } from './users'
import { UserDetailsComponent } from './users';
import { 
    EventsComponent,
    EventDetailsComponent,
    EventRegistrationModalComponent,
    EventListComponent,
    AddEventComponent,
    EditableEventComponent,
    EditEventComponent
} from './events';

import {
    GroupsComponent,
    GroupListComponent,
    EditableGroupComponent,
    EditGroupComponent,
    GroupDetailsComponent,
    AddGroupComponent
} from './groups';

const routes = [
    { path: '', redirectTo: 'login', terminal: true, pathMatch: 'full' },
    { path: 'user-details', component: UserDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'events', component: EventsComponent },
    { path: 'events/add', component: AddEventComponent },
    { path: 'events/:id', component: EventDetailsComponent },
    { path: 'events/edit/:id', component: EditEventComponent },
    { path: 'groups', component: GroupsComponent },
    { path: 'groups/add', component: AddGroupComponent },
    { path: 'groups/:id', component: GroupDetailsComponent },
    { path: 'groups/edit/:id', component: EditGroupComponent }
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
        AddGroupComponent
    ],
    entryComponents: [
        EventRegistrationModalComponent
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