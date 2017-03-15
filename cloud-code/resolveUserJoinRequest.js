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
            done();
        })
        .catch(function(err) {
            setErrorResponse(response, err);
            done();
        });
});

function setErrorResponse(response, errObj) {
    if (typeof errObj === 'string') {
        errObj = { message: errObj };
    }
    response.result = errObj;
    response.statusCode = 400;
    console.log('err: ' + JSON.stringify(errObj.message || errObj));
}
