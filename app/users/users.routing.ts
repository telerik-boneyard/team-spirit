import { Routes } from "@angular/router";

import {
    UserDetailsComponent,
    LoginComponent,
    EditUserComponent,
    PasswordResetModalComponent
} from './';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'edit', component: EditUserComponent },
    { path: '', component: UserDetailsComponent }
];
