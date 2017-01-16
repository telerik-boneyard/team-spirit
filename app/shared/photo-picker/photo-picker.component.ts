import { Component, Input, OnInit } from '@angular/core';

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

    ngOnInit() {
        if (!this.rawUrl) {
            this.rawUrl = this._decidePlaceholder();
        }

        this.resizedUrl = this._resizeAccordingly(this.rawUrl, this.type);
    }

    onEdit(event) {
        if (this.editable) {
            console.log('picking...');
        } else {
            console.log('editable is false...');
        }
    }

    private _decidePlaceholder() {
        let placeholder = '';

        if (this.type === 'event') {
            placeholder = constants.imagePlaceholders.event;
        } else if (this.type === 'group') {
            placeholder = constants.imagePlaceholders.group;
        } else {
            placeholder = constants.imagePlaceholders.user;
        }

        return placeholder;
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
        let dimensions;
        if (dims) {
            dimensions = { width: dims.w, height: dims.h };
        }
        return utilities.getAsResizeUrl(url, dimensions);
    }
}
