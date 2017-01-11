import { constants } from './';

export function getAsResizeUrl (rawUrl: string, opts = { width: 500, height: 275 }) {
    return `https://bs1.cdn.telerik.com/image/v1/${constants.appId}/resize=w:${opts.width},h:${opts.height},fill:cover/${rawUrl}`;
}

export const dateFormat = 'MMM dd, yyyy, hh:mm a';

export const eventMandatoryFields = [ 'OrganizerId', 'LocationName', 'Name', 'GroupId' ];

export function isNonemptyString (str: any) {
    return (typeof str === 'string') && str !== '';
};

export function shouldDisableDrawer (activeRouteUrl: string) {
    return constants.disabledDawerRoutes.some(r => !activeRouteUrl.indexOf(r));
};
