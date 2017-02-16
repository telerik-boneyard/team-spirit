import { Routes } from "@angular/router";
import { EverliveProvider, UsersService, AuthGuardService } from '../services';

import {
    UserDetailsComponent,
    LoginComponent,
    EditUserComponent,
    PasswordResetModalComponent
} from './';

export const routes: Routes = [
    { path: 'user/login', component: LoginComponent },
    { path: 'user/edit', canActivate: [ AuthGuardService ], component: EditUserComponent },
    { path: 'user', canActivate: [ AuthGuardService ], component: UserDetailsComponent },
];
