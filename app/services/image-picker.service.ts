import { Injectable } from '@angular/core';

import * as nsPermissions from 'nativescript-permissions';
import * as nsPicker from 'nativescript-imagepicker';
import * as nsImgSource from 'image-source';
import * as nsPlatform from 'platform';
import * as fs from 'file-system';

import { EverliveProvider } from './';
declare const android: any;

@Injectable()
export class ImagePickerService {
    private _imageItems: any[] = [];
    
    constructor(
        private _elProvider: EverliveProvider
    ) {}

    pickImage() {
        return this._pick('single')
            .then(images => images[0]);
    }

    pickImages() {
        return this._pick('multiple');
    }

    getBase64FromUri(uri: string) {
        let imgSrc = nsImgSource.fromFileOrResource(uri);
        return imgSrc.toBase64String('png');
    }

    private _pick(mode: string): Promise<{ name: string, uri: string }[]> {
        let ctx = nsPicker.create({ mode });
        let authPromise = Promise.resolve<any>();

        if (nsPlatform.device.os === 'Android' && (+nsPlatform.device.sdkVersion >= 23))  {
            let text = 'We need these permissions to read from storage';
            let permType = android.Manifest.permission.READ_EXTERNAL_STORAGE;
            authPromise = nsPermissions.requestPermission(permType, text);
        }

        return authPromise.then(() => this._presentPicker(ctx))
            .then((res) => {
                return this._processImages(res);
            }, (err) => {
                console.log('user cancelled or refused to grant permissions');
                return Promise.reject(false);
            });
    }

    private _presentPicker(context: any) {
        return context.authorize()
            .then(() => {
                return context.present();
            });
    }

    private _processImages(selection: any[]): Promise<{ name: string, uri: string }[]> {
        let processedImgs: Promise<any>[] = selection.map((selectedItem) => {
            return selectedItem.getImage().then(imgSource => {
                return this._processImage(imgSource);
            });
        });

        return Promise.all(processedImgs);
    }

    private _processImage(imageSource: any): Promise<{ name: string, uri: string }> {
        let name = `teamupimg${Date.now()}.png`;
        let folder = fs.knownFolders.documents();
        let uri = fs.path.join(folder.path, name);
        let saved = imageSource.saveToFile(uri, 'png');
        let imgItem = null;

        if (saved) {
            imgItem = { name, uri };
        } else {
            console.log('didnt save!!!');
        }
        
        return imgItem;
    }

    // private _sendImage(name, uri) {        
    //     let base64;

    //     try {
    //         let imgSrc = nsImgSource.fromFileOrResource(uri);
    //         base64 = imgSrc.toBase64String('png');
    //     } catch (ex) {
    //         console.log('err parsing as base64: ' + JSON.stringify(ex.message));
    //         return Promise.reject({ message: 'Could not read image' });
    //     }

    //     return Promise.resolve();
    // }

    // private _sendImages(imgData: { name: any, uri: any }[]) {
    //     let sendPromises: Promise<any>[] = [];

    //     imgData.forEach(data => {
    //         if (data) {
    //             console.log(`id: ${JSON.stringify(data)}`);
    //             sendPromises.push(this._sendImage(data.name, data.uri));
    //         }
    //     });

    //     return Promise.all(sendPromises);
    // }
}
