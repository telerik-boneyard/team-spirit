Everlive.Events.beforeCreate(function(request, context, done) {
    request.data.Approved = !!request.data.Approved;
    request.data.Resolved = !!request.data.Resolved;
    done();
});

Everlive.Events.afterCreate(function(request, response, context, done) {
	if (response.statusCode !== 201) { // ignore for now
		return done();
	}
	var groupId = request.data.GroupId;
	var el = Everlive.Sdk.withMasterKey();
	var reqsDb = el.data('GroupJoinRequests');
	var groupsDb = el.data('Groups');

	groupsDb.getById(groupId)
		.then(function(res) {
			var group = res.result;
			if (!group) {
				return Promise.reject('Group with this ID was not found');
			}

			var createdReqId = response.result.Id;
			return reqsDb.setAcl({ UsersCanRead: [group.Owner] }, response.result);
		})
		.then(function(res) {
			// console.log('acl res: ' + JSON.stringify(res));
			done();
		})
		.catch(function(err) {
			console.log('err: ' + err.message);
			if (typeof err === 'string') {
				err = { message: err };
			}
			response.result = err;
			done();
		});
});

Everlive.Events.afterUpdate(function(request, response, context, done) {
	var el = Everlive.Sdk.withMasterKey();
	var reqsDb = el.data('GroupJoinRequests');
	var membershipsDb = el.data('GroupMembers');

	reqsDb.getById(request.itemId).then(function(resp) {
		var updatedRequests = [].concat(resp.result);
		var updatePromises = updatedRequests.map(function(req) {
            if (!req.Approved) {
                return Promise.resolve();
            }
			return membershipsDb.create({ UserId: req.ApplicantId, GroupId: req.GroupId })
				.then(function(resp) {
					return membershipsDb.setOwner(req.ApplicantId, resp.result.Id);
				});
		});
		return Promise.all(updatePromises);
	})
	.then(function() {
		done();
	})
	.catch(function() {
		response.result = { message: 'Could create all group registrations' };
		response.statusCode = 500;
		done();
	});
});

/*
Everlive.Events.beforeRead(function(request, context, done) {
	var groupId = request.filterExpression && request.filterExpression.GroupId;
	var isCountReq = request.specificAction === 'GetCount';
	var hasMasterRights = request.principal.type !== 'user';
	if ((!groupId && !isCountReq) || hasMasterRights) {
		return done();
	}
	
	var el = Everlive.Sdk.withMasterKey();
	var reqsDb = el.data('GroupJoinRequests');
	var groupsDb = el.data('Groups');
	groupsDb.getById(groupId)
		.then(function(res) {
			var group = res.result;

			if (!group || !group.RequiresApproval) {
				return Promise.reject('Group with this id was not found or does not require approval');
			}

			if (request.principal.id !== group.Owner) {
				return Promise.reject('You are not authorized to view requests for this group');
			}
			var func = isCountReq ? reqsDb.count : reqsDb.get;
			return func.call(reqsDb.withHeaders({ 'x-everlive-disable-custom-code': true }), request.filterExpression);
			// return reqsDb.withHeaders({ 'x-everlive-disable-custom-code': true }).get(request.filterExpression);
            // return reqsDb.withHeaders({ 'x-everlive-disable-custom-code': true }).count(request.filterExpression);
		})
		.then(function(res) {
            console.log('res: ' + JSON.stringify(res));
			Everlive.Response.sendObject(res.result);
			done();
		})
		.catch(function(err) {
			var msg = err;
			if (typeof err !== 'string') {
				msg = err.message;
			}
			Everlive.Response.setErrorResult(msg);
			done();
		});
});
*/
