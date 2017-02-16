import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { RouterModule } from "@angular/router";
import { eventsRoutes } from './events.routing';
import { SharedModule } from '../shared';

import { 
    EventsComponent,
    EventDetailsComponent,
    EventRegistrationModalComponent,
    EventCreationModalComponent,
    EventListComponent,
    AddEventComponent,
    EditableEventComponent,
    EditEventComponent,
    EventParticipantsComponent
} from './';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    SharedModule,
    RouterModule.forChild(eventsRoutes)
  ],
  declarations: [
    EventsComponent,
    EventDetailsComponent,
    EventRegistrationModalComponent,
    EventCreationModalComponent,
    EventListComponent,
    AddEventComponent,
    EditableEventComponent,
    EditEventComponent,
    EventParticipantsComponent
  ],
  entryComponents: [
    EventRegistrationModalComponent,
    EventCreationModalComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class EventsModule {}
