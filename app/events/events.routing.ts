import { Routes } from "@angular/router";
import { AuthGuardService } from '../services';

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
  { path: 'events', canActivate: [ AuthGuardService ], children: [
            { path: '', component: EventsComponent },
            { path: 'add', component: AddEventComponent },
            { path: ':id', component: EventDetailsComponent },
            { path: ':id/edit', component: EditEventComponent },
            { path: ':id/participants', component: EventParticipantsComponent },
        ]
    }
];
