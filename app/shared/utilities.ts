import { constants } from './';

export function getAsResizeUrl (rawUrl: string, opts = { width: constants.imageWidth, height: 200 }) {
    return `https://bs1.cdn.telerik.com/image/v1/${constants.appId}/resize=w:${opts.width},h:${opts.height},fill:cover/${rawUrl}`;
};

export const dateFormat = 'MMM dd, yyyy, hh:mm a';

export const eventMandatoryFields = [ 'OrganizerId', 'LocationName', 'Name', 'GroupId' ];

export function compareStringsForSort (str1: string, str2: string) {
    let result: number;
    if (str1 < str2) {
        result = -1;
    } else if (str1 > str2) {
        result = 1;
    } else {
        result = 0;
    }
    return result;
};

export function urlHasProtocol (str: string) {
    let regExp = new RegExp('^[a-z]+://.+', 'i');
    return regExp.test(str);
}

export function isEmail (str: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return str && re.test(str);
};

export function isNonemptyString (str: any) {
    return (typeof str === 'string') && str !== '';
};

export function shouldDisableDrawer (activeRouteUrl: string) {
    return constants.disabledDawerRoutes.some(r => r.test(activeRouteUrl));
};

export function showIf (shouldShow: boolean) {
    return shouldShow ? 'visible' : 'collapse';
};

export function getRandomInteger (max = 100, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomElement<T> (arr: T[]) {
    return arr[getRandomInteger(0, arr.length - 1)];
};

export function find<T> (arr: T[], predicate: (item: T) => any): T {
    for (let item of arr) {
        if (predicate(item)) {
            return item;
        }
    }
};

export function findIndex<T> (arr: T[], predicate: (item: T) => any): number {
    for (let i = 0; i < arr.length; i++) {
        if (predicate(arr[i])) {
            return i;
        }
    }

    return -1;
};

export function isLocalFileUrl (url: string) {
    let dataPathRegExp = new RegExp('^\/.*', 'i');
    return url && dataPathRegExp.test(url);
};

export function isResourceUrl (url: string) {
    let resourceRegExp = new RegExp('^res:\/\/', 'i');
    return url && resourceRegExp.test(url);
}

export function shallowCopy<T> (obj: T) {
    let res: T = {} as T;
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            res[prop] = obj[prop];
        }
    }
    return res;
};

export function startsWith (str: string, substr: string) {
    return str.indexOf(substr) === 0;
}

export function prettifySystemErrors (rawErrorMsg: string) {
    let errorsToPrettify = Object.keys(constants.systemErrorMsgs);
    let result: string = rawErrorMsg;
    let keyIndex = findIndex(errorsToPrettify, errMsg => startsWith(rawErrorMsg, errMsg));

    if (keyIndex !== -1) {
        let prettifyKey = errorsToPrettify[keyIndex];
        result = constants.systemErrorMsgs[prettifyKey];
    }
    return result;
}

export function getTransition(name?: string, duration?: number, curve?: string) {
    return {
        name: name || 'slideLeft',
        duration: duration || 350,
        curve: curve || 'easeOut'
    };
}

export function getMenuTransition() {
    return getTransition('slideRight');
}

export function getPageTransition() {
    return getTransition();
}
