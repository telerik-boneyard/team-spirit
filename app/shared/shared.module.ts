import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptUISideDrawerModule, SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';
import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA } from "@angular/core";

import {
    AlertService,
    EventsService,
    UsersService,
    EventRegistrationsService,
    PlatformService,
    LoadingIndicatorService,
    ImagePickerService
} from '../services';

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
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [AlertService, EventsService, UsersService, EventRegistrationsService, PlatformService, LoadingIndicatorService, ImagePickerService]
        };
    }
}
