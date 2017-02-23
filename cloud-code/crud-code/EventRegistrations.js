function sendNotification (notifData) {
    var rsvp = require('rsvp');
    return new rsvp.Promise(function(resolve, reject) {
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'MasterKey ' + Everlive.Parameters.masterKey
        };
        Everlive.Http.post(Everlive.Parameters.apiBaseUrlSecure + '/v1/' + Everlive.Parameters.apiKey + '/Functions/notifyUsers', { headers: headers, body: notifData }, function(err, resp) {
            if (err) {
                reject(err);
            } else {
                resolve(resp.body);
            }
        });
    });
}

Everlive.Events.afterCreate(function(request, response, context, done) {
	if (response.result) {
        var notifData = {
        	alertType: 'UserRegisteredForEvent',
            userId: request.data.UserId,
            eventId: request.data.EventId
        };
        sendNotification(notifData);
    }
    
    done();
});

Everlive.Events.afterDelete(function(request, response, context, done) {
    // this is set up to notify only when request is from app
    // (deletion is by filter with both UserId and EventId)
    var userId = request.filterExpression && request.filterExpression.UserId;
    var eventId = request.filterExpression && request.filterExpression.EventId;
    var isAppDelete = userId && eventId;

    if (isAppDelete) {
        var notifData = {
            alertType: 'UserUnregisteredFromEvent',
            userId: userId,
            eventId: eventId
        };
        sendNotification(notifData);
    }
    
    done();
});
