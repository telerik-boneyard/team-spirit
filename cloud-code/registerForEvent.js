Everlive.CloudFunction.onRequest(function(request, response, done){
    var eventId = request.queryString.eventId;
    if (!eventId) {
        response.body = {
            message: 'No event specified.'
        };
        response.statusCode = 400;

        return done();
    }
    
    var userId = request.queryString.userId;
    if (!userId) {
        if (request.principal.type === 'user') {
            userId = request.principal.id;
        } else {
            response.body = {
            	message: 'No user specified.'
            };
            response.statusCode = 400;
            
            return done();
        }
    }
    
    var userChoices = JSON.parse(request.queryString.userChoices);
    
    var el = Everlive.Sdk.withMasterKey();
    var eventRegistrationsDB = el.data('EventRegistrations');
    var groupMembersDB = el.data('GroupMembers');
    var eventsDB = el.data('Events');
    
	eventsDB.getById(eventId)
        .then(function(eventResult) {
            var event = eventResult.result;
            return groupMembersDB.get({ GroupId: event.GroupId, UserId: userId });
        })
        .then(function(groupMembersResult) {
            if (groupMembersResult.count === 1) {
                var eventRegistration = {
                    EventId: eventId,
                    UserId: userId,
                    Choices: userChoices
                };
                return eventRegistrationsDB.create(eventRegistration)
                .then(function(createResult) {
                    return eventRegistrationsDB.setOwner(userId, createResult.result.Id);
                })
                .then(function(setOwnerResult) {
                    done();
                })
                .catch(onError(response, done));
            } else {
                response.body = {
                    message: 'To register for the specified event, the user must be a member of its group.'
                };
                response.statusCode = 400;

                return done();
            }
        })
        .catch(onError(response, done));
});

function onError(response, done) {
    return function(error) {
        console.log('error: ' + error.message);
    	response.result = error;
    	done();
    };
}