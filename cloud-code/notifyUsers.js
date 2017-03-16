Everlive.CloudFunction.onRequest(function(request, response, done) {
    getData(request.data)
        .then(function(context) {
            return Promise.all([sendPush(request.data.alertType, context), sendEmail(context.email)]);
        })
        .then(done)
        .catch(function(err) {
            console.log('err: ' + JSON.stringify(err.message));
            done();
        });
});

// === COMMON ======================================================

function getEvent (eventId) {
    var el = Everlive.Sdk.withMasterKey();
    var eventsDB = el.data('Events');
    return eventsDB.getById(eventId);
}

function getUser (userId) {
    var el = Everlive.Sdk.withMasterKey();
    var usersDB = el.data('Users');
    return usersDB.getById(userId);
}

function getGroup (groupId) {
    var el = Everlive.Sdk.withMasterKey();
    var groupDB = el.data('Groups');
    return groupDB.getById(groupId);
}

function getGroupMembers (groupId) {
    var el = Everlive.Sdk.withMasterKey();
    var groupMembersDB = el.data('GroupMembers');
    
    var headers = {
        'x-everlive-single-field': 'UserId',
        'x-everlive-expand': '{ "UserId": { "TargetTypeName": "Users" } }'
    };
    return groupMembersDB.withHeaders(headers).get({ GroupId: groupId });
}

function getEventRegistrationsCount (eventId) {
    var el = Everlive.Sdk.withMasterKey();
    var eventRegistrationsDB = el.data('EventRegistrations');
    return eventRegistrationsDB.count({EventId: eventId});
}

function getJoinReq(applicantId, groupId) {
    var el = Everlive.Sdk.withMasterKey();
    var groupDB = el.data('GroupJoinRequests');
    return groupDB.get({ ApplicantId: applicantId, GroupId: groupId });
}

function filterForNotification (users, skipUserId) {
    var recipients = [];
    var userIds = [];
    users.forEach(function(user) {
        if (!user || (skipUserId !== undefined && user.Id === skipUserId)) {
            return;
        }
        
        if (user.PushNotificationsEnabled) {
            userIds.push(user.Id);
        }

        if (user.EmailNotificationsEnabled) {
            recipients.push(user.Email);
        }
    });
    return {
        recipients: recipients,
        userIds: userIds
    };
}

function getDataForUserRegisteredForEvent (context) {
    var userId = context.userId;
    var eventId = context.eventId;
    var event, user, members;
    var eventRegistrationsCount;
    var eventDate, eventDateChoices;

    if (!userId || !eventId) {
        return Promise.reject({ message: 'Missing user or event id' });
    }

    return getEvent(eventId)
        .then(function(eventResult) {
            event = eventResult.result;
            return getUser(userId);
        })
        .then(function(userResult) {
            user = userResult.result;
            return getEventRegistrationsCount(eventId);
        })
        .then(function(eventRegistrationsCountResult) {
            eventRegistrationsCount = eventRegistrationsCountResult.result;
            return getGroupMembers(event.GroupId);
        })
        .then(function(getMemberEmailsResult) {
            var users = getMemberEmailsResult.result;
            var emailContext = {
                UserName: user.DisplayName,
                EventName: event.Name,
                EventDate: eventDate,
                EventDateChoices: eventDateChoices,
                VotedUsersCount: eventRegistrationsCount,
                AllUsersCount: users.length,
                IsMultiChoice: context.isMultiChoice
            };
            var userData = filterForNotification(users, userId);

            return {
                userName: user.DisplayName,
                eventName: event.Name,
                push: { userIds: userData.userIds },
                email: {
                    templateName: 'UserRegisteredForEvent',
                    recipients: userData.recipients,
                    context: emailContext
                }
            };
        });
}

function _formatDate (dateIsoString, timezoneName) {
    if (!dateIsoString) {
        return 'Unknown';
    }

    var moment = require('moment-timezone');
    var date = moment(dateIsoString).tz(timezoneName || 'UTC');
    return date.format('MMM D, YYYY, ddd, hh:mm A');
}

function getDataForEventRelated (templateName, context) {
    var event, group, members, organizer;
    return Promise.all([getEvent(context.eventId), getGroup(context.groupId), getGroupMembers(context.groupId)])
        .then(function(results) {
            event = results[0].result;
            group = results[1].result;
            members = results[2].result;
            return getUser(event.OrganizerId);
        })
        .then(function(organizerRes) {
            var organizer = organizerRes.result;
            event.Organizer = organizer.DisplayName;
            var timezoneName = event.Timezone || organizer.Timezone;
            if (event.EventDate) {
                event.EventDate = _formatDate(event.EventDate, timezoneName);
            } else {
                event.EventDateChoices = event.EventDateChoices.map(function(dateOption) {
                    return _formatDate(dateOption, timezoneName);
                });
            }

            var userData = filterForNotification(members);
            var emailContext = {
                Event: event,
                GroupName: group.Name,
                OrganizerName: organizer.DisplayName
            };

            return {
                eventName: event.Name,
                groupName: group.Name,
                organizerName: organizer.DisplayName,
                push: { userIds: userData.userIds },
                email: {
                    templateName: templateName,
                    recipients: userData.recipients,
                    context: emailContext // TODO: this can be taken from context, but template needs to be redone
                }
            };
        });
}

function getDataForUserJoinedGroup (context) {
    var group, user;
    return getGroup(context.groupId)
        .then(function(groupRes) {
            group = groupRes.result;
            return getUser(context.userId);
        })
        .then(function(userRes) {
            user = userRes.result;
            return getGroupMembers(group.Id);
        })
        .then(function(membersRes) {
            var members = membersRes.result;
            var userData = filterForNotification(members, user.Id);
            var emailContext = {
                UserName: user.DisplayName,
                GroupName: group.Name
            };
            return {
                groupName: group.Name,
                userName: user.DisplayName,
                push: { userIds: userData.userIds },
                email: {
                    templateName: 'UserJoinedGroup',
                    recipients: userData.recipients,
                    context: emailContext // TODO: this can be taken from context, but template needs to be redone
                }
            };
        });
}

function getDataForUserAskedToJoinGroup (context) {
    var group, user, owner;
    return getGroup(context.groupId)
        .then(function(groupRes) {
            group = groupRes.result;
            return getUser(group.Owner);
        })
        .then(function(ownerRes) {
            owner = ownerRes.result;
            return getUser(context.userId);
        })
        .then(function(userRes) {
            user = userRes.result;
            return getJoinReq(user.Id, group.Id);
        })
        .then(function(reqRes) {
            var emailContext = {
                UserName: user.DisplayName,
                UserEmail: user.Email, // or Username - it is actually email
                GroupName: group.Name
            };
            return {
                groupName: group.Name,
                userName: user.DisplayName,
                userEmail: user.Email,
                push: { userIds: [owner.Id] },
                email: {
                    templateName: 'UserAskedToJoinGroup',
                    recipients: [owner.Email], // or Username - it is actually email
                    context: emailContext
                }
            };
        });
}

function getDataForUserUnregisteredFromEvent (context) {
    var event, unregisteredUser, organizer;
    var promises = [
        getEvent(context.eventId),
        getUser(context.userId)
    ];

    return Promise.all(promises)
        .then(function(result) {
            event = result[0].result;
            unregisteredUser = result[1].result;
            if (!event || !unregisteredUser) {
                return Promise.reject({ message: 'Could not find event or user' });
            }
            return getUser(event.OrganizerId);
        })
        .then(function(resp) {
            organizer = resp.result;
            if (!organizer) {
                return Promise.reject({ message: 'Could not find organizer' });
            }
        })
        .then(function() {
            var userData = filterForNotification([organizer]);
            var emailContext = {
                User: unregisteredUser.DisplayName,
                Event: event.Name
            };

            // TODO: extract this part, lots of refactoring in this file :/
            return {
                eventName: event.Name,
                userName: unregisteredUser.DisplayName,
                push: { userIds: userData.userIds },
                email: {
                    templateName: 'UserUnregisteredFromEvent',
                    recipients: userData.recipients,
                    context: emailContext
                }
            };
        });
}

function getDataForGroupJoinRequestResolved (context) {
    var group, user;
    var promises = [
        getGroup(context.groupId),
        getUser(context.userId)
    ];

    return Promise.all(promises)
        .then(function(resp) {
            group = resp[0].result;
            user = resp[1].result;
            
            if (!group || !user) {
                return Promise.reject({ message: 'Could not find group or user' });
            }

            var userData = filterForNotification([user]);
            var emailContext = {
                UserName: user.DisplayName || user.Username,
                GroupName: group.Name,
                WasApproved: context.wasApproved
            };

            return {
                groupName: group.Name,
                wasApproved: context.wasApproved,
                push: { userIds: userData.userIds },
                email: {
                    templateName: 'GroupJoinRequestResolved',
                    recipients: userData.recipients,
                    context: emailContext
                }
            };
        });
}

function getDataForEventHasBeenCancelled (context) {
    var event = context.event;
    if (!event) {
        return Promise.reject({ message: 'No event has been passed!' });
    }

    return Promise.all([getGroupMembers(event.GroupId), getUser(event.OrganizerId), getGroup(event.GroupId)])
        .then(function(results) {
            var groupMembers = results[0].result;
            var organizer = results[1].result;
            var group = results[2].result;

            var userData = filterForNotification(groupMembers, event.OrganizerId);
            var emailContext = {
                EventName: event.Name,
                GroupName: group.Name,
                OrganizerName: organizer.DisplayName || organizer.Username
            };

            return {
                groupName: group.Name,
                eventName: event.Name,
                organizerName: organizer.DisplayName || organizer.Username,
                push: { userIds: userData.userIds },
                email: {
                    templateName: 'EventHasBeenCancelled',
                    recipients: userData.recipients,
                    context: emailContext
                }
            };
        });
}

function getData (context) {
    return getterByAlertType['getDataFor' + context.alertType](context);
}

var getterByAlertType = {
    getDataForEventRegistrationClosed: getDataForEventRelated.bind(null, 'EventRegistrationClosed'),
    getDataForEventRegistrationOpen: getDataForEventRelated.bind(null, 'EventRegistrationOpen'),
    getDataForEventDatesUpdated: getDataForEventRelated.bind(null, 'EventDatesUpdated'),
    getDataForUserUnregisteredFromEvent: getDataForUserUnregisteredFromEvent,
    getDataForGroupJoinRequestResolved: getDataForGroupJoinRequestResolved,
    getDataForUserRegisteredForEvent: getDataForUserRegisteredForEvent,
    getDataForEventHasBeenCancelled: getDataForEventHasBeenCancelled,
    getDataForUserAskedToJoinGroup: getDataForUserAskedToJoinGroup,
    getDataForUserJoinedGroup: getDataForUserJoinedGroup
};

// === EMAIL ======================================================

function sendEmail (data) {
    if (!data.recipients || !data.recipients.length) {
        return Promise.resolve();
    }
    
    if (data.recipients.length > 1) {
        data.context.BccRecipients = data.recipients.join(',');
        data.recipients = null;
    }
    
    return new Promise(function(resolve, reject) {
        Everlive.Email.sendEmailFromTemplate(data.templateName, data.recipients, data.context, function(err) {
            if (err) {
                console.log('sendEmail error : ' + JSON.stringify(err));
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// === PUSH ======================================================

function sendPush (alertType, context) {
    
    if (!context.push || !context.push.userIds || !context.push.userIds.length) {
        return Promise.resolve();
    }
    
    var el = Everlive.Sdk.withMasterKey();
    var notifObject = getNotificationObject(alertType, context);
    return el.push.send(notifObject);
}

function getNotificationObject (alertType, context) {
    var title = '';
    var message = '';
    
    switch(alertType) {
        case 'EventRegistrationOpen':
            title = 'New event in "' + context.groupName + '"!';
            message = 'The event is ' + context.eventName + '.';
            break;
        case 'EventRegistrationClosed':
            title = '"' + context.eventName + '" has a final date!';
            message = 'All the details for "' + context.eventName + '" have been decided on.';
            break;
        case 'EventDatesUpdated':
            title = 'Event date options changed';
            message = 'The dates for ' + context.eventName + ' have changed. Please update your vote.';
            break;
        case 'UserRegisteredForEvent':
            title = 'Make room for one more!';
            message = context.userName + ' just registered for ' + context.eventName;
            break;
        case 'UserJoinedGroup':
            title = context.groupName + ' grows!' ;
            message = context.userName + ' has joined ' + context.groupName;
            break;
        case 'UserAskedToJoinGroup':
            title = 'New request to join ' + context.groupName;
            message = context.userName + ' asked to join ' + context.groupName;
            break;
        case 'UserUnregisteredFromEvent':
            title = context.userName + ' decided not to come';
            message = context.userName + ' is not coming to ' + context.eventName;
            break;
        case 'GroupJoinRequestResolved':
            title = context.wasApproved ? 'You\'re in!' : 'Tough ruling';
            message = (context.wasApproved ? 'Your' : 'Unfortunately, your') + ' request to join ' + context.groupName + ' was ' + (context.wasApproved ? 'approved!' : 'denied');
            break;
        case 'EventHasBeenCancelled':
            title = context.eventName + ' was cancelled!';
            message = context.organizerName + ' cancelled the event for ' + context.groupName;
            break;


        default: // TODO: remove this, it's for testing purposes only
            title = 'New Message!';
            message = 'Well, we dont know what it is... :|';
            break;
    }
    
    return formNotification(title, message, context.push.userIds);
}

function formNotification (title, message, userIds) {
	return {
        Filter: { UserId: { $in: userIds } },
        Android: formAndroidNotification(title, message),
        IOS: formIosNotification(title, message)
    };
}

function formAndroidNotification(title, message, data) {
    var notif = {
        // notification: {
        //     title: title,
        //     body: message,
        //     sound: 'default',
        //     color: '#F4550F',
        //     icon: 'ic_stat_notify'
        // },
        data: {
            title: title,
            message: message,
            sound: 'default',
            color: '#F4550F',
            smallIcon: 'ic_stat_notify',
            largeIcon: 'icon'
        }
    };
    
    if (data) {
        notif.data = objAssign(notif.data || {}, data);
    }
    
    return notif;
}

function formIosNotification(title, message, data) {
    var notif = {
        aps: {
            alert: {
                title: title,
                body: message
            }
        }
    };
    if (data) {
        notif = objAssign(notif, data);
    }
    return notif;
}

function objAssign (destObj, srcObj) {
    for (var prop in srcObj) {
        if (srcObj.hasOwnProperty(prop)) {
            destObj[prop] = srcObj[prop];
        }
    }
    return destObj;
}
