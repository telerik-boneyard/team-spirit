"use strict";
var core_1 = require('@angular/core');
var everlive_provider_service_1 = require('./everlive-provider.service');
var EventsService = (function () {
    function EventsService(_elProvider) {
        this._elProvider = _elProvider;
        this._data = this._elProvider.get.data('Events');
    }
    EventsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [everlive_provider_service_1.EverliveProvider])
    ], EventsService);
    return EventsService;
}());
exports.EventsService = EventsService;
//# sourceMappingURL=events.service.js.map