Everlive.Events.afterCreate(function(request, response, context, done) {
    // TODO: multiple create?
    
    var createdGroupId = response.result && response.result.Id;
    if (!createdGroupId) {
    	return done();
    }
    
    var el = Everlive.Sdk.withMasterKey();
    var membershipDb = el.data('GroupMembers');
    membershipDb.create({ UserId: request.principal.id, GroupId: createdGroupId })
        .then(function() {
            done();
        })
        .catch(function(err) {
            console.log('err: ' + JSON.stringify(err.message));
            done(); // ignoring errors, since group was already created and that's the important part
        });
    
});

Everlive.Events.afterDelete(function(request, response, context, done) {    
    var deletedGroupId = request.itemId;
    if (!deletedGroupId) {
        return done();
    }
    
    var el = Everlive.Sdk.withMasterKey();
    el.data('GroupMembers').destroy({ GroupId: deletedGroupId })
        .then(function(resp) {
            done();
        })
        .catch(function(err) {
            console.log('could not delete memberships: ' + JSON.stringify(err));
            Everlive.Response.setErrorResult(err);
            done();
        });
});
