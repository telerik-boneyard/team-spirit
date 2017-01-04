import { constants } from './constants';

export function getAsResizeUrl (rawUrl: string, opts = { width: 500, height: 400 }) {
    return `https://bs1.cdn.telerik.com/image/v1/${constants.appId}/resize=w:${opts.width},h:${opts.height},fill:cover/${rawUrl}`;
}

export const dateFormat = 'MMM dd, yyyy, hh:mm a';
