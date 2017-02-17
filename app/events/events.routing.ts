import { Routes } from "@angular/router";
import { AuthGuard } from '../services';

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

export const eventsRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '', canActivate: [AuthGuard], component: EventsComponent },
            { path: 'add', component: AddEventComponent },
            { path: ':id', component: EventDetailsComponent },
            { path: ':id/edit', component: EditEventComponent },
            { path: ':id/participants', component: EventParticipantsComponent },
        ]
    }
];
