import { constants } from './';

export function getAsResizeUrl (rawUrl: string, opts = { width: 500, height: 275 }) {
    return `https://bs1.cdn.telerik.com/image/v1/${constants.appId}/resize=w:${opts.width},h:${opts.height},fill:cover/${rawUrl}`;
};

export const dateFormat = 'MMM dd, yyyy, hh:mm a';

export const eventMandatoryFields = [ 'OrganizerId', 'LocationName', 'Name', 'GroupId' ];

export function isNonemptyString (str: any) {
    return (typeof str === 'string') && str !== '';
};

export function shouldDisableDrawer (activeRouteUrl: string) {
    return constants.disabledDawerRoutes.some(r => r.test(activeRouteUrl));
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

export function isLocalUrl (url: string) {
    let regExp = new RegExp('^\/.*', 'i');
    return url && regExp.test(url);
};
