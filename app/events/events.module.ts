import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptRouterModule } from "nativescript-angular/router";
import { eventsRoutes } from './events.routing';
import { SharedModule } from '../shared';

import {
    EventsComponent,
    EventDetailsComponent,
    EventCreationModalComponent,
    AddEventComponent,
    EditableEventComponent,
    EditEventComponent,
    EventParticipantsComponent,
    FinalizeEventComponent,
    EventDateSelectionComponent
} from './';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forChild(eventsRoutes),
    SharedModule
  ],
  declarations: [
    EventsComponent,
    EventDetailsComponent,
    EventCreationModalComponent,
    AddEventComponent,
    EditableEventComponent,
    EditEventComponent,
    EventParticipantsComponent,
    FinalizeEventComponent,
    EventDateSelectionComponent
  ],
  entryComponents: [
    EventCreationModalComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class EventsModule {}
