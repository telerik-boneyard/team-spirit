import { Injectable } from '@angular/core';

import * as nsPermissions from 'nativescript-permissions';
import * as nsPicker from 'nativescript-imagepicker';
import * as nsImgSource from 'image-source';
import * as nsPlatform from 'platform';

import { EverliveProvider } from './';
import { constants } from '../shared';

declare const android: any, CGSizeMake: any, UIGraphicsBeginImageContextWithOptions: any, CGRectMake: any, UIGraphicsEndImageContext: any, UIGraphicsGetImageFromCurrentImageContext: any;

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
        let imgRatio = imgSrc.width / imgSrc.height;
        imgSrc = this.resizeImage(imgSrc, constants.imageWidth, constants.imageWidth / imgRatio);
        let format = (uri.match(/[^\.]+$/i)[0]) || 'png';
        let result = {
            format: format,
            base64: imgSrc.toBase64String(format)
        };
        return result;
    }

    resizeImage(image: nsImgSource.ImageSource, newWidth: number, newHeight: number) {
        let result: any = null;
        if (image.android) {
            result = this._resizeAndroid(image.android, newWidth, newHeight);
        } else {
            result = this._resizeAndroid(image.ios, newWidth, newHeight);
        }
        let resizedImgSrc = new nsImgSource.ImageSource();
        resizedImgSrc.setNativeSource(result);
        return resizedImgSrc;
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
                return Promise.reject(false);
            });
    }

    private _presentPicker(context: any) {
        return context.authorize()
            .then(() => context.present());
    }

    private _processImages(selection: any[]): Promise<{ name: string, uri: string }[]> {
        let processedImgs: Promise<any>[] = selection.map((selectedItem) => {
            return Promise.resolve({
                uri: selectedItem.fileUri,
                thumb: selectedItem.thumb
            });
        });

        return Promise.all(processedImgs);
    }

    private _resizeAndroid(originalImage: any, newWidth: number, newHeight: number) {
        var resizedBitmap = android.graphics.Bitmap.createScaledBitmap(originalImage, newWidth, newHeight, true);
        return resizedBitmap;
    }

    private _resizeIos(originalImage: any, newWidth: number, newHeight: number) {
        let cgSize = CGSizeMake(newWidth, newHeight);
        UIGraphicsBeginImageContextWithOptions(cgSize, false, 0.0);

        originalImage.drawInRect(CGRectMake(0, 0, newWidth, newHeight));
        let newImageSource = UIGraphicsGetImageFromCurrentImageContext();

        UIGraphicsEndImageContext();
        return newImageSource;
    }
}
