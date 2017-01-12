import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
// import { DatePicker } from "ui/date-picker";
// import { TimePicker } from "ui/time-picker";

// import { EventsService, AlertService, UsersService, GroupsService } from '../../services';
// import { Event, Group, User } from '../../shared/models';
// import { utilities } from '../../shared';

@Component({
    selector: 'app-modal',
    templateUrl: 'shared/app-modal/app-modal.template.html',
    styleUrls: [ 'shared/app-modal/app-modal.component.css' ]
})
export class AppModalComponent {
    @Output('ok') okCallback = new EventEmitter<any>();
    @Output('cancel') cancelCallback = new EventEmitter<any>();

    onOk() {
        this.okCallback.emit();
    }

    onCancel() {
        this.cancelCallback.emit();
    }
}
