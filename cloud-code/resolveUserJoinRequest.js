Everlive.CloudFunction.onRequest(function(request, response, done){
    
    var userId = request.queryString.userId;
    var groupId = request.queryString.groupId;
    var allow = request.queryString.allow;
    
    
    done();
});
