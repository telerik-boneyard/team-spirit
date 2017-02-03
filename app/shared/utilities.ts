import { constants } from './';

export function getAsResizeUrl (rawUrl: string, opts = { width: 400, height: 200 }) {
    return `https://bs1.cdn.telerik.com/image/v1/${constants.appId}/resize=w:${opts.width},h:${opts.height},fill:cover/${rawUrl}`;
};

export const dateFormat = 'MMM dd, yyyy, hh:mm a';

export const eventMandatoryFields = [ 'OrganizerId', 'LocationName', 'Name', 'GroupId' ];

export function isEmail (str: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(str);
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

export function shallowCopy (obj) {
    let res: any = {};
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            res[prop] = obj[prop];
        }
    }
    return res;
};
