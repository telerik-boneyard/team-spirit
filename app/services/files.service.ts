import { Injectable } from '@angular/core';

import { EverliveProvider } from './everlive-provider.service';
import { ImagePickerService } from './image-picker.service';

@Injectable()
export class FilesService {

    constructor(
        private _elProvider: EverliveProvider,
        private _imagesService: ImagePickerService
    ) {}

    upload(base64File: string, extension: string, filename?: string) {
        let data = {
            Filename: filename || `teamupimg${Date.now()}.${extension}`,
            ContentType: `image/${extension}`,
            base64: base64File
        };

        return this._elProvider.get.files.create(data)
            .then((res: any) => {
                let result = res.result;
                return {
                    Id: result.Id,
                    Uri: result.Uri
                };
            });
    }

    uploadFromUri(uri: string) {
        let imgData = this._imagesService.getBase64FromUri(uri);
        return this.upload(imgData.base64, imgData.extension);
    }
}
