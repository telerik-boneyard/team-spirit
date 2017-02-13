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
        approved = approved === 'true' ? true : false;
    }

    var el = Everlive.Sdk.withMasterKey();
    var requestsDb = el.data('GroupJoinRequests');
    var groupsDb = el.data('Groups');

    requestsDb.getById(reqId)
        .then(function(resp) {
            var req = resp.result;
            if (req.Resolved) {
                return Promise.reject({ message: 'This request has already been resolved' });
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
