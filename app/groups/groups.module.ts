import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

// import { RouterModule } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
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
    GroupMembersComponent
} from './';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
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
    GroupMembersComponent
  ],
  entryComponents: [
    GroupCreationModalComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GroupsModule {
  constructor() {
    console.log('groups module instantiated');
  }
}
