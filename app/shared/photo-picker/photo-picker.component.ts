import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ImagePickerService } from '../../services';
import { utilities } from '../';

@Component({
    moduleId: module.id,
    selector: 'photo-picker',
    templateUrl: './photo-picker.template.html',
    styleUrls: [ './photo-picker.component.css' ]
})
export class PhotoPickerComponent implements OnInit {
    private _resizedUrl: string;

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

    get resizedUrl() {
        if (!this.rawUrl) {
            return null;
        }

        if (!this._resizedUrl) {
            this._resizedUrl = this._resizeAccordingly(this.rawUrl, this.type);
        }
        return this._resizedUrl;
    }

    set resizedUrl(newValue: string) {
        this._resizedUrl = newValue;
    }

    ngOnInit() {
        this.noImageText = this.noImageText || ''; // patch for NS blowing up if setting text-decoration of undefined
    }

    onEdit(event) {
        if (!this.editable) {
            return;
        }

        this._imgPickerService.pickImage()
            .then(pickResult => {
                this.resizedUrl = pickResult.uri;
                this.onUpload.emit(pickResult.uri);
            })
            .catch(err => {
                if (err) {
                    console.log('pick err: ' + err.message);
                }
            });
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
