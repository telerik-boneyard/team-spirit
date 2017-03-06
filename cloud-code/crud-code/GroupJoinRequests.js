Everlive.Events.beforeCreate(function(request, context, done) {
    request.data.Approved = !!request.data.Approved;
    request.data.Resolved = !!request.data.Resolved;
    done();
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
		console.log('success');
		done();
	})
	.catch(function() {
		response.result = { message: 'Could create all group registrations' };
		response.statusCode = 500;
		done();
	});
});
