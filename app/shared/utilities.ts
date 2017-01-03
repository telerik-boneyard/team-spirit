export function getAsResizeUrl (rawUrl: string, opts = { width: 300, height: 200 }) {
    return `https://bs1.cdn.telerik.com/image/v1/35ylfmbdmpzbqn0c/resize=w:${opts.width},h:${opts.height},fill:cover/${rawUrl}`;
}
