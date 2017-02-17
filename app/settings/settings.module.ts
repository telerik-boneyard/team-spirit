import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptRouterModule } from "nativescript-angular/router";
import { routes } from './settings.routing';
import { SharedModule } from '../shared';

import {
    SettingsComponent
} from './';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
      SettingsComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SettingsModule {}
