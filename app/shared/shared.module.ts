import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptUISideDrawerModule, SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import {
    AppModalComponent,
    DateTimePickerModalComponent,
    ListPickerModalComponent,
    PhotoPickerComponent,
    UserDisplayComponent,
    UsersListComponent,
    EventListComponent,
    DismissableInputDirective,
    PageLayoutComponent
} from './';

@NgModule({
  providers: [
    SIDEDRAWER_DIRECTIVES
  ],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptUISideDrawerModule
  ],
  declarations: [
    AppModalComponent,
    DateTimePickerModalComponent,
    ListPickerModalComponent,
    PhotoPickerComponent,
    UserDisplayComponent,
    UsersListComponent,
    EventListComponent,
    DismissableInputDirective,
    PageLayoutComponent
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
    EventListComponent,
    DismissableInputDirective,
    PageLayoutComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {}
