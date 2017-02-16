import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { RouterModule } from "@angular/router";
import { routes } from './groups.routing';

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

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    GroupsComponent,
    GroupListComponent,
    EditableGroupComponent,
    EditGroupComponent,
    GroupDetailsComponent,
    AddGroupComponent,
    GroupCreationModalComponent,
    GroupEventsComponent,
    GroupMembersComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GroupsModule {}
