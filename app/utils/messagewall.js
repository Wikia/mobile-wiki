export function getMessageWallOwner(url) {
    const regex = /\/Message_Wall:(.+?)([?#/].*)?$/i;
    const result = regex.exec(url);
    if (!result || !result[1]) {
        return null;
    }
    return result[1];
}
