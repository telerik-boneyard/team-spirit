"use strict";
var core_1 = require('@angular/core');
var services_1 = require('../../services');
var UpcomingEventsComponent = (function () {
    function UpcomingEventsComponent(_eventsService) {
        this._eventsService = _eventsService;
        this.dateFormat = 'MMM dd, yyyy, hh:mm a';
    }
    UpcomingEventsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._eventsService.getAll()
            .then(function (events) {
            _this.events = events;
            _this.handleError(events[0]);
        }, this.handleError);
    };
    UpcomingEventsComponent.prototype.getEventDate = function (event) {
        var date = null;
        if (event.EventDate) {
            date = new Date(event.EventDate);
        }
        else {
            date = new Date(event.EventDateChoices[0]); // TODO: fix
        }
        return date;
    };
    UpcomingEventsComponent.prototype.getRemainingTime = function (event) {
        var oneDay = 24 * 60 * 60 * 1000;
        var eventDate = this.getEventDate(event);
        var days = Math.round((eventDate.getTime() - Date.now()) / oneDay);
        if (days > 0) {
            return days + ' Days';
        }
        else if (days < 0) {
            return days + ' Days ago';
        }
        else {
            return 'TODAY';
        }
    };
    UpcomingEventsComponent.prototype.showDetails = function (event) {
        console.log('show details clicked');
    };
    UpcomingEventsComponent.prototype.handleError = function (error) {
        console.log(JSON.stringify(error));
    };
    UpcomingEventsComponent = __decorate([
        core_1.Component({
            selector: 'upcoming-events',
            templateUrl: 'events/upcoming-events/upcoming-events.template.html'
        }), 
        __metadata('design:paramtypes', [services_1.EventsService])
    ], UpcomingEventsComponent);
    return UpcomingEventsComponent;
}());
exports.UpcomingEventsComponent = UpcomingEventsComponent;
//# sourceMappingURL=upcoming-events.component.js.map