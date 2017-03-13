import { Directive, OnInit, Input, ElementRef } from '@angular/core';
// import { TextField } from 'ui/text-field';
import { PlatformService } from '../../services';

@Directive({
    selector: '[dismissable]'
})
export class DismissableInputDirective implements OnInit {
    @Input('dismissable') anchorName: string;
    private _field: any;
    private _wasFieldClick: boolean = false;
    
    constructor(el: ElementRef, private _platform: PlatformService) {
        this._field = el.nativeElement;
        this._field.on('tap', () => this._wasFieldClick = true);
    }

    ngOnInit() {
        this._field.page.on('navigatingFrom', () => {
            this._field.dismissSoftInput();
        });

        let anchor = this._field.page.getViewById(this.anchorName || 'dismissableAnchor');
        anchor.on('tap', (args) => {
            if (this._platform.isAndroid) {
                return this._field.dismissSoftInput();
            }

            // hack to keep keyboard open on iOS cause of
            // different event propagation to Android
            setTimeout(() => {
                if (!this._wasFieldClick) {
                    this._field.dismissSoftInput();
                }
                this._wasFieldClick = false;
            }, 0);
        });
    }
}
