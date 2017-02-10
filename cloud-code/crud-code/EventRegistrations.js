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

Everlive.Events.afterCreate(function(request, response, context, done) {
	if (response.result) {
    	var el = Everlive.Sdk.withMasterKey();
        var reqData = {
        	alertType: 'UserRegisteredForEvent',
            userId: request.data.UserId,
            eventId: request.data.EventId
        };
        makePostReq(reqData)
            .then(done)
            .catch(function(err) {
                console.log('err: ' + JSON.stringify(err));
                done();
            });
    } else {
    	done();
    }
});


/*
Everlive.Events.afterCreate(function(request, response, context, done) {
    if (response.result) {
        var eventId = request.data.EventId;
        var userId = request.data.UserId;

        if (userId && eventId) {

            var el = Everlive.Sdk.withMasterKey();
            var eventsDB = el.data('Events');
            var groupMembersDB = el.data('GroupMembers');
            var usersDB = el.data('Users');

            var event;
            var user;
            var members;

            eventsDB.getById(eventId)
            .then(function(eventResult) {
                event = eventResult.result;
                return usersDB.getById(userId);
            })
            .then(function(userResult) {
                user = userResult.result;
                var headers = {
                    'x-everlive-single-field': 'UserId',
                    'x-everlive-expand': '{ "UserId": { "TargetTypeName": "Users", "SingleField": "Email" } }'
                };
                return groupMembersDB.withHeaders(headers).get({ GroupId: event.GroupId, UserId: { $ne: userId } });
            })
            .then(function(getMemberEmailsResult) {
                var recipients = getMemberEmailsResult.result;
                var emailContext = {
                    UserName: user.DisplayName,
                    EventName: event.Name
                };
                Everlive.Email.sendEmailFromTemplate('UserRegisteredForEvent', ['dimo.mitev@progress.com'], emailContext,
                    function(res) {
                        done();
                    }
                );
            })
            .catch(onError(response, done));

        } else {
            done();
        }
    }
});

function onError(response, done) {
    return function(error) {
        console.log('error: ' + error.message);
    	response.result = error;
    	done();
    };
}
*/