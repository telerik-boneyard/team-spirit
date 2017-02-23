const loaderUtils = require("loader-utils");

const platformSheetMatcher = /(@import.+)(["'])(.+)(platform\.css)\2/g;

module.exports = function(content, map) {
    if (this.cacheable) {
        this.cacheable();
    }

    const options = loaderUtils.parseQuery(this.query);
    let newSource = content.replace(platformSheetMatcher, `$1$2$3platform.${options.platform}.css$2`);
 
    // Support for tests
    if (this.callback) {
        this.callback(null, newSource, map);
    } else {
        return newSource;
    }
};
