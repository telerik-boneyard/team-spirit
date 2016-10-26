"use strict";
var shared_1 = require('../shared');
var User = (function () {
    function User(Username, DisplayName, Email, ProfilePicture) {
        this.Username = Username;
        this.DisplayName = DisplayName;
        this.Email = Email;
        this.ProfilePicture = ProfilePicture;
        this.ProfilePicture = ProfilePicture || shared_1.constants.emptyImage;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.model.js.map