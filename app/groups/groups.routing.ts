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
    { path: 'groups', component: GroupsComponent },
    { path: 'groups/add', component: AddGroupComponent },
    { path: 'groups/:id', component: GroupDetailsComponent },
    { path: 'groups/:id/edit', component: EditGroupComponent },
    { path: 'groups/:id/events', component: GroupEventsComponent },
    { path: 'groups/:id/members', component: GroupMembersComponent }
];
