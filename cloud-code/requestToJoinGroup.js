function sendNotification (data) {
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
                                var requestsDb = el.data('GroupJoinRequests');
                                requestsDb.get({ GroupId: groupId, ApplicantId: userId })
                                    .then(function(requestsResult) {
                                        var req = requestsResult.result[0];
                                        if (requestsResult.count !== 0 && !canReapply(req.ModifiedAt)) {
                                            var message = 'You have already applied for "' + group.Name + '". You can apply again no sooner than ' + formatDate(getEarliestReapplyDate(req.ModifiedAt)) + '.';
                                            return Promise.reject({ message: message });
                                        }
                                        var joinRequest = {
                                            ApplicantId: userId,
                                            GroupId: groupId
                                        };
                                        if (requestsResult.count === 1 && canReapply(req.ModifiedAt)) {
                                            req.Resolved = false;
                                            req.Approved = false;
                                            return requestsDb.updateSingle({
                                                Id: req.Id,
                                                Resolved: false,
                                                Approved: false
                                            }).then(function(resp) {
                                                if (resp.result === 1) {
                                                    return { result: req };
                                                } else {
                                                    return Promise.reject({ message: 'Unexpected requests count' });
                                                }
                                            });
                                        } else {
                                            return requestsDb.create(joinRequest);
                                        }
                                    })
                                    .then(function(createResp){
                                        var notifData = {
                                            alertType: 'UserAskedToJoinGroup',
                                            groupId: groupId,
                                            userId: userId
                                        };
                                        sendNotification(notifData); // dont wait for notification response
                                        return requestsDb.setOwner(userId, createResp.result.Id);
                                    })
                                    .then(done)
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

function canReapply (resolvedOn) {
    var earliestReapplyDate = getEarliestReapplyDate(resolvedOn);
    var can = earliestReapplyDate <= new Date();
    return can;
}

function getEarliestReapplyDate (resolvedOn) {
    var moment = require('moment');
    return moment(resolvedOn).add(1, 'week').toDate();
}

function formatDate (date) {
    var moment = require('moment');
    return moment(date).format('MMM D, YYYY, ddd, hh:mm A') + ' (UTC)';
}

function onError(response, done) {
    return function(error) {
        console.log('error: ' + error.message);
        response.statusCode = 400;
    	response.result = error;
    	done();
    };
}