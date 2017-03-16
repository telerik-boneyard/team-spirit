var Promise = require('rsvp').Promise;

Everlive.CloudFunction.onRequest(function(request, response, done) {
    if (request.action.toUpperCase() !== 'GET') {
        setErrorResponse(response, 'This function only accepts GET requests');
        return done();
    }

    var reqId = request.queryString.reqId;
    var approved = request.queryString.approved;

    if (approved !== 'true' && approved !== 'false') {
        setErrorResponse(response, 'Please specify if the join request should be approved or denied');
        return done();
    } else {
        approved = approved === 'true';
    }

    var el = Everlive.Sdk.withMasterKey();
    var requestsDb = el.data('GroupJoinRequests');
    var groupsDb = el.data('Groups');

    var req, group;

    requestsDb.getById(reqId)
        .then(function(resp) {
            req = resp.result;
            if (req.Resolved) {
                return Promise.reject({ message: 'This request has already been resolved' });
            }
            return groupsDb.getById(req.GroupId);
        })
        .then(function(resp) {
            group = resp.result;
            if (request.principal.type === 'user' && group.Owner !== request.principal.id) {
                return Promise.reject({ message: 'You are not authorized for this operation' });
            }
            req.Approved = approved;
            req.Resolved = true;
            return requestsDb.updateSingle(req);
        })
        .then(function(resp) {
            var updatedCount = resp.result;
            var result = { message: 'Successfully resolved ' + updatedCount + ' requests' };
            if (!updatedCount) {
                result.message = 'Could not resolve request';
                response.statusCode = 400;
            }
            response.result = result;

            sendNotificationsToUsers(req.GroupId, req.ApplicantId, req.Approved); // dont wait for result
            done();
        })
        .catch(function(err) {
            setErrorResponse(response, err);
            done();
        });
});

function sendNotificationsToUsers(groupId, userId, wasApproved) {
    var reqData = {
        alertType: 'GroupJoinRequestResolved', // TODO: differentiate between templateName and alert type
        groupId: groupId,
        userId: userId,
        wasApproved: wasApproved
    };
    notifyUsers(reqData);
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

function setErrorResponse(response, errObj) {
    if (typeof errObj === 'string') {
        errObj = { message: errObj };
    }
    response.result = errObj;
    response.statusCode = 400;
    console.log('err: ' + JSON.stringify(errObj.message || errObj));
}
