import { Injectable } from '@angular/core';
import Everlive from 'everlive-sdk';
import { Item } from '../../node_modules/everlive-sdk/dist/declarations/everlive/interfaces/Item';

import * as nsPlatform from 'platform';

import { utilities, constants } from '../shared';

@Injectable()
export class EverliveProvider {
    private _everlive: Everlive;

    constructor() {
        this._everlive = new Everlive({
            appId: constants.appId,
            authentication: {
                persist: true
            }
        });
    }

    get get(): Everlive {
        return this._everlive;
    }

    getData<T extends Item>(collectionName: string) {
        return this._everlive.data<T>(collectionName);
    }

    getNewQuery() {
        return new Everlive.Query();
    }

    getNewAggregateQuery() {
        return new Everlive.AggregateQuery();
    }

    subscribeForPushNotifications(userId: string) {
        let pushRegSettings = {
            iOS: { badge: true, sound: true, alert: true },
            android: { senderID: constants.androidProjNumber }
        };

        let useSettings: any = this._isAndroid() ? pushRegSettings.android : pushRegSettings.iOS;
        var pushPlugin = require('nativescript-push-notifications');

        return new Promise<any>((resolve, reject) => {
            pushPlugin.register(useSettings, (token) => {
                this._createDeviceReg(token, userId).then(res => resolve(res))
                    .catch((err) => {
                        console.log('push register error ' + JSON.stringify(err));

                        if (err.code !== 601) {
                            return reject(err);
                        }
                        let regOpts: any = {
                            authHeaders: true,
                            method: 'PUT',
                            data: { "UserId": userId },
                            endpoint: `Push/Devices/HardwareId/${nsPlatform.device.uuid}`
                        };

                        return this._everlive.request(regOpts).send();
                    })
                    .then(resp => {
                        console.log('device update success: ' + JSON.stringify(resp));
                        resolve(resp);
                    })
                    .catch(err => {
                        console.log('device update update err: '+ JSON.stringify(err));
                        reject(err);
                    });
            }, error => {
                console.log('pp reg error: ' + JSON.stringify(error));
                reject(error);
            });
        });
    }

    private _createDeviceReg(token: string, userId: string) {
        let data = {
            HardwareId: nsPlatform.device.uuid,
            HardwareModel: nsPlatform.device.model,
            PushToken: token,
            Locale: 'en_US',
            TimeZone: 'Europe/Sofia',
            PlatformType: this._isAndroid() ? 3 : 4,
            PlatformVersion: nsPlatform.device.osVersion
        };
        return this._everlive.push.devices.create(data);
    }

    private _isAndroid() {
        let platformName = nsPlatform.device.os.toLowerCase();
        return platformName === 'android';
    }
}
