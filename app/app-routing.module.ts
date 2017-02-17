import { NgModule } from '@angular/core';
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { AuthGuard } from './services';
import { SettingsComponent } from './settings';

const routes: any = [
    {
        path: 'settings',
        canActivate: [ AuthGuard ],
        loadChildren: () => {
            console.log('++++ s called');
            return require('./settings/settings.module')['SettingsModule'];
        }
    },
    {
        path: 'events',
        loadChildren: () => {
            console.log('++++ e called');
            return require('./events/events.module')['EventsModule'];
        }
    },
    {
        path: 'groups',
        loadChildren: () => {
            console.log('++++ g called');
            return require('./groups/groups.module')['GroupsModule'];
        }
    },
    {
        path: 'user',
        loadChildren: () => {
            console.log('++++ u called');
            return require('./users/users.module')['UsersModule'];
        }
    },
    { path: '', redirectTo: 'events', pathMatch: 'full' }
];

@NgModule({
  imports: [
    NativeScriptRouterModule.forRoot(routes)
  ],
  exports: [
    NativeScriptRouterModule
  ],
  providers: [ AuthGuard ]
})
export class AppRoutingModule {}
