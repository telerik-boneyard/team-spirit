var rsvp = require('rsvp');
var Promise = rsvp.Promise;

Everlive.CloudFunction.onRequest(function(request, response, done){
    var eventId = request.queryString.eventId;
    var wantArr = request.queryString.asArray === 'true';
    if (!eventId) {
        response.body = {
            message: 'No event specified.'
        };
        response.statusCode = 400;
        return done();
    }

    var el = Everlive.Sdk.withMasterKey();
    var eventsDb = el.data('Events');
    var regsDb = el.data('EventRegistrations');
    var membershipsDb = el.data('GroupMembers');
    var event, regs;
    var currentUserId = request.principal.id;

    eventsDb.getById(eventId)
        .then(function(res) {
            event = res.result;
            if (!event) {
                return getErrorPromise('This event was not found');
            }
            return membershipsDb.get({ GroupId: event.GroupId, UserId: currentUserId });
        })
        .then(function(res) {
            var currentUserMembership = res.result[0]; // should be only one
            if (!currentUserMembership && request.principal.type === 'user') {
                return getErrorPromise('You are not a member of the group this event belongs to');
            }
            return regsDb.get({ EventId: eventId });
        })
        .then(function(res) {
            regs = res.result;

            var dates = event.EventDateChoices;
            if (!dates) {
                dates = [event.EventDate];
            }
            dates = dates.map(function(d) {
                return d.toISOString();
            });

            var result = {};
            regs.forEach(function(reg) {
                if (!reg.Choices) {
                    return;
                }
                
                reg.Choices.forEach(function(choice) {
                    var c = choice.toISOString();
                    if (result[c]) {
                        result[c] += 1;
                    } else {
                        result[c] = 1;
                    }
                });
            });

            dates.forEach(function(d) { // make sure all date options are present in the result object
                if (!result[d]) {
                    result[d] = 0;
                }
            });
            Object.keys(result).forEach(function(d) { // remove votes which are not for current date options
                if (result.hasOwnProperty(d) && dates.indexOf(d) === -1) {
                    delete result[d];
                }
            });
            
            if (wantArr) {
                var arrRes = [];
                Object.keys(result).forEach(function(date) {
                    arrRes.push({ date: date, count: result[date] });
                });
                result = arrRes;
            }

            response.body = result;
            done();
        })
        .catch(function(err) {
            response.body = err;
            response.statusCode = 400;
            console.log('err: ' + JSON.stringify(err.message));
            done();
        });
});

function getErrorPromise (msg) {
    return Promise.reject({ message: msg });
}
