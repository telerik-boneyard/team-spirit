import { Routes } from "@angular/router";
import { EverliveProvider, UsersService, AuthGuardService } from '../services';
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
} from './';

export const routes: Routes = [
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
