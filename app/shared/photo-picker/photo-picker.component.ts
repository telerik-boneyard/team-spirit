import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import * as nsImgSource from 'image-source';
import * as nsImage from 'ui/image';

import { ImagePickerService } from '../../services';
import { utilities, constants } from '../';

@Component({
    selector: 'photo-picker',
    templateUrl: 'shared/photo-picker/photo-picker.template.html',
    styleUrls: [ 'shared/photo-picker/photo-picker.component.css' ]
})
export class PhotoPickerComponent implements OnInit {
    resizedUrl: string;

    @Input('url') rawUrl: string;
    @Input() type: string;
    @Input('small') isSmall: boolean;
    @Input() editable: boolean;
    @Input() noImageIcon: string;
    @Input() noImageText: string;

    @Output('urlChange') onUpload = new EventEmitter<any>();

    constructor(
        private _imgPickerService: ImagePickerService
    ) {}

    ngOnInit() {
        if (!this.rawUrl) {
            return;
        }

        this.resizedUrl = this._resizeAccordingly(this.rawUrl, this.type);
    }

    onEdit(event) {
        if (this.editable) {
            this._imgPickerService.pickImage()
                .then(obj => {
                    console.log('picked:' + JSON.stringify(obj));
                    // this.onUpload.emit(obj);

                    // this.editableImg.imageSource = nsImgSource.fromFileOrResource(obj.uri);
                    this.resizedUrl = obj.uri;
                    this.onUpload.emit(obj.uri);
                })
                .catch(err => {
                    console.log('pick err: ' + JSON.stringify(err));
                });
        } else {
            console.log('editable is false...');
        }
    }

    private _resizeAccordingly(rawUrl: string, type: string) {
        switch (type) {
            case 'group':
                return this._resizeForGroup(rawUrl, this.isSmall);

            case 'user':
                return this._resizeForUser(rawUrl, this.isSmall);

            case 'event':
                return this._resizeForEvent(rawUrl);

            default: {
                return this._resizeForEvent(rawUrl);
            }
        }
    }

    private _resizeForUser(url: string, small: boolean = false) {
        let size = small ? 60 : 300;
        let dims = { w: size, h: size };
        return this._resize(url, dims);
    }

    private _resizeForGroup(url: string, small: boolean = false) {
        let size = small ? 50 : 300;
        let dims: any = null;
        if (small) {
            dims = { w: size, h: size };
        }
        return this._resize(url, dims);
    }

    private _resizeForEvent(url: string) {
        return this._resize(url);
    }

    private _resize(url: string, dims?: { w: number, h: number }) {
        if (utilities.isResourceUrl(url)) {
            return url;
        }

        let dimensions;
        if (dims) {
            dimensions = { width: dims.w, height: dims.h };
        }
        return utilities.getAsResizeUrl(url, dimensions);
    }
}
