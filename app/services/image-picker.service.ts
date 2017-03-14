import { Injectable } from '@angular/core';

import * as nsPermissions from 'nativescript-permissions';
import * as nsPicker from 'nativescript-imagepicker';
import * as nsImgSource from 'image-source';
import * as nsPlatform from 'platform';
import * as fs from 'file-system';

import { EverliveProvider } from './';
import { PlatformService } from './platform.service';
import { constants } from '../shared';

declare const android: any, CGSizeMake: any, UIGraphicsBeginImageContextWithOptions: any, CGRectMake: any, UIGraphicsEndImageContext: any, UIGraphicsGetImageFromCurrentImageContext: any;

@Injectable()
export class ImagePickerService {
    private _imageItems: any[] = [];
    
    constructor(
        private _elProvider: EverliveProvider,
        private _platform: PlatformService
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
        let width = constants.imageWidth;
        let height = constants.imageWidth / imgRatio;

        imgSrc = this.resizeImage(imgSrc, width, height);
        let format = this._getExtension(uri) || 'png';
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
            result = this._resizeIos(image.ios, newWidth, newHeight);
        }
        let resizedImgSrc = new nsImgSource.ImageSource();
        resizedImgSrc.setNativeSource(result);
        return resizedImgSrc;
    }

    private _getExtension(fileUri: string) {
        return fileUri.match(/[^\.]+$/i)[0];
    }

    private _pick(mode: string): Promise<{ thumb: any, uri: string }[]> {
        let ctx = nsPicker.create({ mode });
        let authPromise = Promise.resolve<any>();

        if (this._platform.isAndroid && (this._platform.sdkVersion >= 23))  {
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

    private _processImages(selection: any[]) {
        let processedImgs = selection.map((selectedItem) => {
            return this._moveImgToTempFolder(selectedItem)
                .then(moveResult => {
                    return {
                        uri: moveResult.uri,
                        thumb: selectedItem.thumb
                    };
                });
            // let descriptor: { uri: string, thumb: any } = {
            //     uri: selectedItem.fileUri,
            //     thumb: selectedItem.thumb
            // };
            // return Promise.resolve(descriptor);
        });

        return Promise.all(processedImgs);
    }
 
    private _moveImgToTempFolder(selectedImg: any): Promise<{ name: string, uri: string }> {
        return selectedImg.getImage()
            .then((imageSrc: nsImgSource.ImageSource) => {
                let extension = ((selectedImg.fileUri && this._getExtension(selectedImg.fileUri)) || 'png').toLowerCase();
                let name = `teamupimg${Date.now()}.${extension}`;
                let tempFolder = fs.knownFolders.temp();
                let uri = fs.path.join(tempFolder.path, name);
                
                let saved = imageSrc.saveToFile(uri, extension);
                var imgItem: { name: string, uri: string } = null;

                if (saved) {
                    imgItem = { name, uri };
                } else {
                    console.log('didnt save!!!');
                }

                return imgItem;
            });
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
