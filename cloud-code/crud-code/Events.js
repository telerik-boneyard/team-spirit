Everlive.Events.afterCreate(function(request, response, context, done) {
    if (response.result) {
        if (request.data.OpenForRegistration) {
            sendNotificationsToUsers(response.result.Id, request.data.GroupId, 'EventRegistrationOpen');
        }
    }
    
    done();
});

Everlive.Events.beforeDelete(function(request, context, done) {
    if (!request.itemId) {
        return done();
    }
    var el = Everlive.Sdk.withMasterKey();
    var eventsDB = el.data('Events');
    eventsDB.getById(request.itemId)
        .then(function(resp) {
            if (isPastEvent(resp.result)) {
                Everlive.Response.setErrorResult('Deletion of past events is not allowed');
            }
            done();
        });
});

Everlive.Events.afterDelete(function(request, response, context, done) {
    if (!request.itemId) {
        return done();
    }
    
    var deletedEventId = request.itemId;
    if (!deletedEventId) {
        return done();
    }
    
    var el = Everlive.Sdk.withMasterKey();
    el.data('EventRegistrations').destroy({ EventId: deletedEventId })
    .then(function(resp) {
        done();
    })
    .catch(function(err) {
        console.log('could not delete event registration: ' + err.message);
        Everlive.Response.setErrorResult(err);
        done();
    });
});

Everlive.Events.beforeUpdate(function(request, context, done) {
    if (request.itemId) {
        var el = Everlive.Sdk.withMasterKey();
        var eventsDB = el.data('Events');

        eventsDB.getById(request.itemId)
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
    if (response.result && request.itemId) {
        var el = Everlive.Sdk.withMasterKey();
        var eventsDB = el.data('Events');

        eventsDB.getById(request.itemId)
            .then(function(getItemResult) {
                var event = getItemResult.result;

                if (!context.RegistrationCompleted && event.RegistrationCompleted) {
                    sendNotificationsToUsers(request.itemId, event.GroupId, 'EventRegistrationClosed');
                }

                if (!context.OpenForRegistration && event.OpenForRegistration) {
                    sendNotificationsToUsers(request.itemId, event.GroupId, 'EventRegistrationOpen');
                }

                if (context.EventDates || event.EventDateChoices) {
                    var oldDates = context.EventDates;
                    var newDates = event.EventDateChoices;
                    var _ = require('underscore');

                    // TODO: refactor
                    if ((!oldDates && newDates) || (oldDates && !newDates)) { // there is a simpler way to write this :)
                        sendNotificationsToUsers(request.itemId, event.GroupId, 'EventDatesUpdated');
                    } else {
                        var byDate = {};
                        oldDates.forEach(function(date) {
                            byDate[date] = true;
                        });
                        for (var i = 0; i < newDates.length; i++) {
                            var key = newDates[i].toISOString();
                            if (byDate[key]) {
                                delete byDate[key];
                            } else {
                                sendNotificationsToUsers(request.itemId, event.GroupId, 'EventDatesUpdated');
                                break;
                            }
                        }
                        if (_.size(byDate)) {
                            sendNotificationsToUsers(request.itemId, event.GroupId, 'EventDatesUpdated');
                        }
                    }
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

function makePostReq (data) {
    var rsvp = require('rsvp');
    return new rsvp.Promise(function(resolve, reject) {
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
    makePostReq(reqData)
    	.then(function(resp) {
        	console.log('resp: ' + JSON.stringify(resp));
            done();
        })
        .catch(function(err) {
        	console.log('err: ' + JSON.stringify(err));
            done();
        });
}

function onError(response, done) {
    return function(error) {
        console.log('error: ' + error.message);
    	response.result = error;
    	done();
    };
}