Everlive.Events.afterCreate(function(request, response, context, done) {
    if (response.result) {
        if (request.data.OpenForRegistration) {
            sendNotificationsToUsers(response.result.Id, request.data.GroupId, 'EventRegistrationOpen');
        }
    }
    
    done();
});

Everlive.Events.beforeDelete(function(request, context, done) {
    var eventId = getIdFromRequest(request);
    var idsFilter = request.filterExpression && request.filterExpression._id && request.filterExpression._id.$in;

    var el = Everlive.Sdk.withMasterKey();
    var eventsDB = el.data('Events');
    var eventsPromise;
    if (eventId) {
        eventsPromise = eventsDB.getById(eventId);
    } else {
        eventsPromise = eventsDB.get(request.filterExpression);
    }
    eventsPromise.then(function(resp) {
        var events = [].concat(resp.result);
        var hasInvalidDeletions = false;
        if (request.principal.type === 'user') {
            events.forEach(function() {
                if (isPastEvent(resp.result)) {
                    hasInvalidDeletions = true;
                }
            });
        }
        if (hasInvalidDeletions) {
            Everlive.Response.setErrorResult('Deletion of past events is not allowed');
        } else {
            context.deletedEvents = events;
        }
        done();
    });
});

Everlive.Events.afterDelete(function(request, response, context, done) {
    var deletedEventId = request.itemId;
    var idsFilter = request.filterExpression && request.filterExpression._id && request.filterExpression._id.$in; // like from portal
    var idsToDelete = [];
    if (!deletedEventId && !idsFilter) {
        return done();
    } else if (deletedEventId) {
        idsToDelete = [deletedEventId];
    } else {
        idsToDelete = idsFilter;
    }
    
    var el = Everlive.Sdk.withMasterKey();
    el.data('EventRegistrations').destroy({ EventId: { $in: idsToDelete } })
        .then(function() {
            (context.deletedEvents || []).forEach(function(event) {
                // dont wait for results of notifications
                // sendNotificationsToUsers(evId, undefined, 'EventHasBeenCancelled');
                var notifData = {
                    alertType: 'EventHasBeenCancelled', // TODO: differentiate between templateName and alert type
                    event: event
                };
                notifyUsers(notifData);
            });
        })
        .then(done)
        .catch(function(err) {
            console.log('could not delete event registration: ' + err.message);
            Everlive.Response.setErrorResult(err);
            done();
        });
});

Everlive.Events.beforeUpdate(function(request, context, done) {
    var eventId = getIdFromRequest(request);
    if (eventId) {
        var el = Everlive.Sdk.withMasterKey();
        var eventsDB = el.data('Events');

        eventsDB.getById(eventId)
        .then(function(getItemResult) {
            var event = getItemResult.result;
            if (isPastEvent(event)) {
                Everlive.Response.setErrorResult('Update of past event is not allowed');
                return done();
            }
            context.RegistrationCompleted = event.RegistrationCompleted;
            context.OpenForRegistration = event.OpenForRegistration;
            context.EventDates = event.EventDateChoices;
            done();
        })
        .catch(onError(response, done));
    } else {
		done();
    }
});

Everlive.Events.afterUpdate(function(request, response, context, done) {
    var eventId = getIdFromRequest(request);
    if (response.result && eventId) {
        var el = Everlive.Sdk.withMasterKey();
        var eventsDB = el.data('Events');

        eventsDB.getById(eventId)
            .then(function(getItemResult) {
                var event = getItemResult.result;

                if (!context.RegistrationCompleted && event.RegistrationCompleted) {
                    sendNotificationsToUsers(eventId, event.GroupId, 'EventRegistrationClosed');
                } else if (context.EventDates || event.EventDateChoices) {
                    var oldDates = context.EventDates;
                    var newDates = event.EventDateChoices;
                    var _ = require('underscore');

                    // TODO: refactor
                    if ((!oldDates && newDates) || (oldDates && !newDates)) { // there is a simpler way to write this :)
                        sendNotificationsToUsers(eventId, event.GroupId, 'EventDatesUpdated');
                    } else {
                        var byDate = {};
                        var notified = false;
                        newDates = newDates.map(function(d) {
                            return d.toISOString();
                        });
                        var datesRemoved = _.difference(oldDates, newDates);
                        if (datesRemoved.length) {
                            sendNotificationsToUsers(eventId, event.GroupId, 'EventDatesUpdated');
                        } else {
                            var datesAdded = _.difference(newDates, oldDates);
                            if (datesAdded.length) {
                                sendNotificationsToUsers(eventId, event.GroupId, 'EventDatesUpdated');
                            }
                        }
                    }
                }

                if (!context.OpenForRegistration && event.OpenForRegistration) {
                    sendNotificationsToUsers(eventId, event.GroupId, 'EventRegistrationOpen');
                }

                done();
            })
            .catch(onError(response, done));
    } else {
		done();
    }
});

function isPastEvent (event) {
    return event && event.EventDate && (new Date() > new Date(event.EventDate));
}

function notifyUsers (data) {
    return new Promise(function(resolve, reject) {
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'MasterKey ' + Everlive.Parameters.masterKey
        };
        Everlive.Http.post(Everlive.Parameters.apiBaseUrlSecure + '/v1/' + Everlive.Parameters.apiKey + '/Functions/notifyUsers', { headers: headers, body: data }, function(err, resp) {
            if (err) {
                reject(err);
            } else {
                resolve(resp.body);
            }
        });
    });
}

function sendNotificationsToUsers(eventId, groupId, templateName, done) {
    done = done || function() {};
    
    var reqData = {
        alertType: templateName, // TODO: differentiate between templateName and alert type
        groupId: groupId,
        eventId: eventId
    };
    notifyUsers(reqData);
}

function getIdFromRequest (request) {
    var id = request.itemId || (request.filterExpression && (request.filterExpression._id || request.filterExpression.Id));
    return id;
}

function onError(response, done) {
    return function(error) {
        console.log('error: ' + error.message);
    	response.result = error;
    	done();
    };
}
