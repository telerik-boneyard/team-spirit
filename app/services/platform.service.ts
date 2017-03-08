import { Injectable } from '@angular/core';

import * as nsPlatform from 'platform';

@Injectable()
export class PlatformService {
    get isAndroid() {
        let platformName = nsPlatform.device.os.toLowerCase();
        return platformName === 'android';
    }

    get isIos() {
        return !this.isAndroid;
    }
    
    get deviceId() {
        return nsPlatform.device.uuid;
    }

    get deviceModel() {
        return nsPlatform.device.model;
    }

    get osVersion() {
        return nsPlatform.device.osVersion;
    }

    get sdkVersion() {
        return Number(nsPlatform.device.sdkVersion);
    }
}
