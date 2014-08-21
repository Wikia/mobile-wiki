/// <reference path="../../baseline/Wikia.d.ts" />

declare module W {
    function getLinkInfo(basepath: string, title: string, hash: string, uri: string): {
        article: string;
        url: string;
    };
}
