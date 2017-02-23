import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import {
    AppModalComponent,
    DateTimePickerModalComponent,
    ListPickerModalComponent,
    PhotoPickerComponent,
    UserDisplayComponent,
    UsersListComponent,
    EventListComponent
} from './';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule
  ],
  declarations: [
    AppModalComponent,
    DateTimePickerModalComponent,
    ListPickerModalComponent,
    PhotoPickerComponent,
    UserDisplayComponent,
    UsersListComponent,
    EventListComponent
  ],
  entryComponents: [
    AppModalComponent,
    DateTimePickerModalComponent,
    ListPickerModalComponent
  ],
  exports: [
    AppModalComponent,
    PhotoPickerComponent,
    UserDisplayComponent,
    UsersListComponent,
    EventListComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {}
