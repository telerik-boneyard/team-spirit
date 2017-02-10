// For best performance, only uncomment functions that you use

/*
Everlive.Events.beforeRead(function(request, context, done) {
	//Enter your custom code here

	//Call done() once you are finished
	done();
});
*/

/*
Everlive.Events.afterRead(function(request, response, context, done) {

	done();
});
*/

Everlive.Events.beforeCreate(function(request, context, done) {
    if (request.data.PushNotificationsEnabled !== false) {
        request.data.PushNotificationsEnabled = true;
    }
    if (request.data.EmailNotificationsEnabled !== false) {
        request.data.EmailNotificationsEnabled = true;
    }
    
	done();
});

/*
Everlive.Events.afterCreate(function(request, response, context, done) {

	done();
});
*/

/*
Everlive.Events.beforeUpdate(function(request, context, done) {

	done();
});
*/

/*
Everlive.Events.afterUpdate(function(request, response, context, done) {

	done();
});
*/

/*
Everlive.Events.beforeDelete(function(request, context, done) {

	done();
});
*/

/*
Everlive.Events.afterDelete(function(request, response, context, done) {

	done();
});
*/

/*
Everlive.Events.beforeAggregate(function(request, context, done) {

	done();
});
*/

/*
Everlive.Events.afterAggregate(function(request, response, context, done) {

	done();
});
*/