import { Routes } from "@angular/router";
import { EverliveProvider, UsersService, AuthGuardService } from './services';
import { SettingsComponent } from './settings';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'events', pathMatch: 'full' },
    { path: 'settings', canActivate: [ AuthGuardService ], component: SettingsComponent },
    
    // { path: 'user/login', component: LoginComponent },
    // { path: 'user/edit', canActivate: [ AuthGuardService ], component: EditUserComponent },
    // { path: 'user', canActivate: [ AuthGuardService ], component: UserDetailsComponent },

    // { path: 'events', canActivate: [ AuthGuardService ], children: [
    //         { path: '', component: EventsComponent },
    //         { path: 'add', component: AddEventComponent },
    //         { path: ':id', component: EventDetailsComponent },
    //         { path: ':id/edit', component: EditEventComponent },
    //         { path: ':id/participants', component: EventParticipantsComponent },
    //     ]
    // },

    // { path: 'groups', canActivate: [ AuthGuardService ], children: [
    //         { path: '', component: GroupsComponent },
    //         { path: 'add', component: AddGroupComponent },
    //         { path: ':id', component: GroupDetailsComponent },
    //         { path: ':id/edit', component: EditGroupComponent },
    //         { path: ':id/events', component: GroupEventsComponent },
    //         { path: ':id/members', component: GroupMembersComponent }
    //     ]
    // }
];
