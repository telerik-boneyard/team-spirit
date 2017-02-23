import { Routes } from "@angular/router";
import { AuthGuard } from '../services';

import { 
    EventsComponent,
    EventDetailsComponent,
    EventRegistrationModalComponent,
    EventCreationModalComponent,
    AddEventComponent,
    EditableEventComponent,
    EditEventComponent,
    EventParticipantsComponent,
    FinalizeEventComponent
} from './';

export const eventsRoutes: Routes = [
    { path: '', canActivate: [AuthGuard], component: EventsComponent },
    { path: 'add', component: AddEventComponent },
    { path: ':id', component: EventDetailsComponent },
    { path: ':id/edit', component: EditEventComponent },
    { path: ':id/participants', component: EventParticipantsComponent },
    { path: ':id/finalize', component: FinalizeEventComponent }
];
