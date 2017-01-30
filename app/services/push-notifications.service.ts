import { Injectable } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

import { EverliveProvider } from './everlive-provider.service';
import { PlatformService } from './platform.service';
import { utilities, constants } from '../shared';

@Injectable()
export class PushNotificationsService {
    constructor(
        private _everlive: EverliveProvider,
        private _router: RouterExtensions,
        private _platform: PlatformService
    ) {}

    private get data() {
        return this._everlive.get.push;
    }

    private pushCb(...args) {
        // let eventId = args[0].eventId;
        console.log('args: ' + JSON.stringify(args));
    }

    subscribe(userId: string) {
        let pushRegSettings = {
            iOS: { badge: true, sound: true, alert: true, notificationCallbackIOS: this.pushCb.bind(this) },
            android: { senderID: constants.androidProjNumber }
        };

        let useSettings: any;
        var pushPlugin = require('nativescript-push-notifications');

        if (this._platform.isAndroid) {
             useSettings = pushRegSettings.android;
             pushPlugin.onMessageReceived(this.pushCb.bind(this));
        } else {
             useSettings = pushRegSettings.iOS;
        }

        return new Promise<any>((resolve, reject) => {
            pushPlugin.register(useSettings, (token) => {
                this._createDeviceReg(token, userId)
                    .then(res => resolve(res))
                    .catch((err) => {
                        if (err.code !== 601) {
                            return reject(err);
                        }
                        let regOpts: any = {
                            // authHeaders: true,
                            method: 'PUT',
                            data: { UserId: userId },
                            endpoint: `Push/Devices/HardwareId/${this._platform.deviceId}`
                        };

                        return this._everlive.makeRequest(regOpts);
                    })
                    .then(resolve)
                    .catch(reject);
            }, reject);
        });
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
