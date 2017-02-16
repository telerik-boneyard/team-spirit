import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
    selector: 'paged-list',
    templateUrl: 'shared/paged-list/paged-list.template.html',
    styleUrls: [ 'shared/paged-list/paged-list.component.css' ]
})
export class PagedListComponent implements OnInit {
    @Input() items: any[];
    @Input() loadMoreText: string;
    @Output() loadMore = new EventEmitter<any>();

    ngOnInit() {
        this.loadMoreText = this.loadMoreText || 'Load more...';
    }

    onLoadMore() {
        this.loadMore.emit();
    }
}
