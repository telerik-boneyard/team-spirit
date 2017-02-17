import { Routes } from "@angular/router";
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
    { path: '', component: GroupsComponent },
    { path: 'add', component: AddGroupComponent },
    { path: ':id', component: GroupDetailsComponent },
    { path: ':id/edit', component: EditGroupComponent },
    { path: ':id/events', component: GroupEventsComponent },
    { path: ':id/members', component: GroupMembersComponent }
];
