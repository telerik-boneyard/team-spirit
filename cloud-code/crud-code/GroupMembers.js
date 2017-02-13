var rsvp = require('rsvp');
var Promise = rsvp.Promise;

function makePostReq (data) {
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
    var groupId = request.data.GroupId;
    var userId = request.data.UserId;
    
    if (userId && groupId) {
        var reqData = {
            alertType: 'UserJoinedGroup', // TODO: differentiate semantically between template name and alert type
            groupId: groupId,
            userId: userId
        };
        makePostReq(reqData); // cant log error if we dont wait for result
    }
    
    done();
});

Everlive.Events.afterDelete(function(request, response, context, done) {
    var userId = request.filterExpression && request.filterExpression.UserId; // user is leaving group. if group is deleted, filter would include groupid
    var groupId = request.filterExpression && request.filterExpression.GroupId;
    
    if (userId) { // how leaveGroup works in the app
        deleteRegistrationsForUser(userId, groupId)
        	.then(done, onError(response, done));
    } else if (context.deletedUserId) { // deleting by id - probably through the portal
        deleteRegistrationsForUser(context.deletedUserId, groupId)
            .then(done, onError(response, done));
    } else {
    	done();
    }
});


// WIP
Everlive.Events.beforeDelete(function(request, context, done) {
    var userId; // Id of user who is leaving group - only handling voluntary leaving now
    var groupId;
    var deleteFilter = request.filterExpression;
    if (deleteFilter && 'UserId' in deleteFilter && 'GroupId' in deleteFilter) {
        userId = deleteFilter.UserId;
        groupId = deleteFilter.GroupId;
    }
    var el = Everlive.Sdk.withMasterKey();
    var membershipsDb = el.data('GroupMembers');
    var groupsDb = el.data('Groups');
    
    if (request.itemId) { // deletting specific reg - probably req from the portal
        membershipsDb.getById(request.itemId)
            .then(function(resp) {
                context.deletedUserId = resp.result.UserId;
                done();
            });
    } else if (userId && groupId) {
    	groupsDb.getById(groupId).then(function(resp) {
        	if (resp.result && resp.result.Owner === userId) {
                Everlive.Response.setErrorResult('An administrator cannot leave their group.');
            }
            done();
        })
        .catch(function(err) {
            console.log('error getting group GroupMembers.beforeDelete: ' + JSON.stringify(err));
            done();
        });
    } else {
    	done();
    }
});



function deleteRegistrationsForUser(userId, groupId) {
    var el = Everlive.Sdk.withMasterKey();
    var eventsDb = el.data('Events');
    var regsDb = el.data('EventRegistrations');
    var requestsDb = el.data('GroupJoinRequests');
    var registrationFilter = [ { OpenForRegistration: true }, { RegistrationCompleted: true } ];
	var oneDay = 86400000;
    var dateFilter = [
        { EventDate: { $gt: new Date(Date.now() + oneDay).toISOString() } }, // keep him registered to events which are soon (within 24hrs)
        { EventDate: { $exists: false } },
        { EventDate: null }
    ];

    var upcomingEventsFilter = {
        $and: [
            { $or: registrationFilter },
            { $or: dateFilter }
        ]
    };
    
    return eventsDb.get(upcomingEventsFilter)
        .then(function(resp) {
            if (resp.result && resp.result.length > 0) {
                var eventIds = resp.result.map(function(e) { return e.Id; });
                var regPrm = regsDb.destroy({ UserId: userId, EventId: { $in: eventIds } });
                var reqsPrm = Promise.resolve();
                if (groupId) {
                    reqsPrm = requestsDb.destroy({ ApplicantId: userId, GroupId: groupId });
                }
                return Promise.all([regPrm, reqsPrm]);
            }
        });
}

function onError(response, done) {
    return function(error) {
        console.log('error: ' + error.message);
    	response.result = error;
        response.statusCode = 400;
    	done();
    };
}