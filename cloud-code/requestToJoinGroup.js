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

Everlive.CloudFunction.onRequest(function(request, response, done){
    var groupId = request.queryString.groupId;
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
    
    var el = Everlive.Sdk.withMasterKey();
    var groupMembersDB = el.data('GroupMembers');
    var groupsDB = el.data('Groups');
    
    var query = new Everlive.Sdk.Query();
    query.where().and().eq('GroupId', groupId).eq('UserId', userId);
    
    groupMembersDB.get(query).then(
        function(getGroupMemberResult) {
            if (!getGroupMemberResult || getGroupMemberResult.count !== 0) {
                response.body = {
                    message: 'The specified user is already part of the group.'
                };
                response.statusCode = 400;
            	done();
            } else {
                groupsDB.getById(groupId).then(
                    function(getGroupResult) {
                        if (getGroupResult.result) {
                            var group = getGroupResult.result;
                            if (group.RequiresApproval) {
                                var joinRequest = {
                                    ApplicantId: userId,
                                    GroupId: groupId
                                };
                                var requestsDb = el.data('GroupJoinRequests');
                                requestsDb.get({ GroupId: groupId, ApplicantId: userId })
                                    .then(function(requestsResult) {
                                        if (requestsResult.count !== 0) {
                                            var rsvp = require('rsvp');
                                            return rsvp.Promise.reject({ message: 'User has already applied' });
                                        }
                                    })
                                    .then(function() {
                                        return requestsDb.create(joinRequest);
                                    })
                                    .then(function(createResp){
                                        return requestsDb.setOwner(userId, createResp.result.Id);
                                    })
                                    .then(function(requestRes) {
                                        var reqData = {
                                            alertType: 'UserAskedToJoinGroup',
                                            groupId: groupId,
                                            userId: userId
                                        };
                                        makePostReq(reqData);
                                        done(); // dont wait for notification response
                                    })
                                    .catch(onError(response, done));
                            } else {
                                var newGroupMember = {
                                    GroupId: groupId,
                                    UserId: userId
                                };
                                groupMembersDB.create(newGroupMember)
                                .then(function(createResult) {
                                	return groupMembersDB.setOwner(userId, createResult.result.Id);
                                })
                                .then(
                                    function() {
                                        response.body = {
                                            message: 'User added successfully to the group.'
                                        };
                            			response.statusCode = 201;
                                        done();
                                    },
                                    onError(response, done)
                                );
                            }
                        } else {
                            response.body = {
                                message: 'The specified group was not found.'
                            };
                            response.statusCode = 400;
                        	done();
                        }
                    },
                    onError(response, done)
            	);
            }
        },
        onError(response, done)
    
    );
});

function onError(response, done) {
    return function(error) {
        console.log('error: ' + error.message);
        response.statusCode = 400;
    	response.result = error;
    	done();
    };
}