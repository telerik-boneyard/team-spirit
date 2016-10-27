"use strict";
var _1 = require('../');
var User = (function () {
    function User(Username, DisplayName, Email, ProfilePicture) {
        this.Username = Username;
        this.DisplayName = DisplayName;
        this.Email = Email;
        this.ProfilePicture = ProfilePicture;
        this.ProfilePicture = ProfilePicture || _1.constants.emptyImage;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.model.js.map