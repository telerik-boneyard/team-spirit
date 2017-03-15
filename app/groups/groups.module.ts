import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { routes } from './groups.routing';
import { SharedModule } from '../shared';

import {
    GroupsComponent,
    GroupListComponent,
    EditableGroupComponent,
    EditGroupComponent,
    GroupDetailsComponent,
    AddGroupComponent,
    GroupCreationModalComponent,
    GroupEventsComponent,
    GroupMembersComponent,
    GroupJoinRequestsComponent
} from './';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forChild(routes),
    SharedModule
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
    GroupMembersComponent,
    GroupJoinRequestsComponent
  ],
  entryComponents: [
    GroupCreationModalComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GroupsModule {}
