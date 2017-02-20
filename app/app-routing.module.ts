import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { AuthGuard } from './services';
import { SettingsComponent } from './settings';

const routes: any = [
    {
        path: 'settings',
        canActivate: [AuthGuard],
        loadChildren: "./settings/settings.module#SettingsModule",
    },
    {
        path: 'events',
        loadChildren: "./events/events.module#EventsModule",
    },
    {
        path: 'groups',
        loadChildren: "./groups/groups.module#GroupsModule",
    },
    {
        path: 'user',
        loadChildren: "./users/users.module#UsersModule",
    },
    { path: '', redirectTo: 'user/login', pathMatch: 'full' }
];

@NgModule({
    imports: [
        NativeScriptRouterModule.forRoot(routes)
    ],
    exports: [
        NativeScriptRouterModule
    ],
    providers: [ AuthGuard ],
    schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppRoutingModule {}
