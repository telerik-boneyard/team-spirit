import { Routes } from "@angular/router";
import { AuthGuard } from './services';
import { SettingsComponent } from './settings';

export const appRoutes: any = [
    { path: '', redirectTo: 'settings', pathMatch: 'full' },
    {
        path: 'events',
        loadChildren: () => {
            let t = require('./events/events.module')['EventsModule'];
            console.log('++++ e called');
            return t;
        }
    },
    {
        path: 'groups',
        loadChildren: () => {
            let t = require('./groups/groups.module')['GroupsModule'];
            console.log('++++ g called');
            return t;
        }
    },
    {
        path: 'user',
        loadChildren: () => {
            let t = require('./users/users.module')['UsersModule'];
            console.log('++++ u called');
            return t;
        }
    },
    { path: 'settings', canActivate: [ AuthGuard ], component: SettingsComponent },
    
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
