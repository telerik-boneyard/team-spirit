import { Injectable } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

import { EverliveProvider } from './everlive-provider.service';
import { PlatformService } from './platform.service';
import { AlertService } from './alert.service';
import { utilities, constants } from '../shared';

@Injectable()
export class PushNotificationsService {
    constructor(
        private _everlive: EverliveProvider,
        private _router: RouterExtensions,
        private _platform: PlatformService,
        private _alertsService: AlertService
    ) {}

    private get data() {
        return this._everlive.get.push;
    }

    private pushCb(...args) {
        console.log('args: ' + JSON.stringify(args));
        this._alertsService.showSuccess('got push' + JSON.stringify(args));
    }

    subscribe(userId: string) {
        let pushRegSettings = {
            iOS: { badge: true, sound: true, alert: true },
            android: { senderID: constants.androidProjNumber },
            notificationCallbackIOS: this.pushCb.bind(this),
            notificationCallbackAndroid: this.pushCb.bind(this)
        };

        return this._everlive.get.push.register(pushRegSettings);
    }

    private _createDeviceReg(token: string, userId: string) {
        let data = {
            HardwareId: this._platform.deviceId,
            HardwareModel: this._platform.deviceModel,
            PushToken: token,
            Locale: 'en_US',
            TimeZone: 'Europe/Sofia',
            PlatformType: this._platform.isAndroid ? 3 : 4,
            PlatformVersion: this._platform.osVersion
        };
        return this.data.devices.create(data);
    }
}
