import { Directive, ElementRef } from '@angular/core';
import { TextField } from 'ui/text-field';
import { Page } from 'ui/page';
import * as viewModule from 'ui/core/view';
import * as gesturesModule from 'ui/gestures';

@Directive({
    selector: '[dismissable]'
})
export class DismissableInputDirective {
    private _field: any;
    
    constructor(el: ElementRef) {
        this._field = el.nativeElement;
    }

    ngOnInit() {
        let anchor = viewModule.getViewById(this._field.page, 'dismissableAnchor');
        anchor.on('tap',() => this._field.dismissSoftInput());
    }
}
