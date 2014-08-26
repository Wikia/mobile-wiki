/// <reference path="../../baseline/Wikia.d.ts" />
interface Location {
    origin: string;
}
declare module W {
    function getLinkInfo(basepath: string, title: string, hash: string, uri: string): {
        article: string;
        url: string;
    };
}
