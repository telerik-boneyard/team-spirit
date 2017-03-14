import { Routes } from "@angular/router";
import { AuthGuard } from '../services';

import { 
    EventsComponent,
    EventDetailsComponent,
    AddEventComponent,
    EditEventComponent,
    EventParticipantsComponent,
    EventDateSelectionComponent,
    FinalizeEventComponent
} from './';

export const eventsRoutes: Routes = [
    { path: '', component: EventsComponent, canActivate: [AuthGuard] },
    { path: 'add', component: AddEventComponent },
    { path: ':id', component: EventDetailsComponent },
    { path: ':id/edit', component: EditEventComponent },
    { path: ':id/finalize', component: FinalizeEventComponent },
    { path: ':id/participants', component: EventParticipantsComponent },
    { path: ':id/date-selection', component: EventDateSelectionComponent },
];
