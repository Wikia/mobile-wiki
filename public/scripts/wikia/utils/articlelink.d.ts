declare module Wikia.Utils {
    /**
    * @param basepath the base url of the wiki without trailing slash, i.e. http://lastofus.wikia.com
    * or http://halo.bisaacs.wikia-dev
    * @param title the title of the article, such as David_Michael_Vigil
    * @param hash jumplink, either '#something' (to indicate there is a jumplink) or '' or undefined
    * @param uri the absolute link
    *
    * @return object in the form { article, url }. Only one of article or url will be non-null. If article is
    * non-null, then the application should transition to that article. If url is non-null, then the application should
    * go to the link directly. NOTE: url might be a jumplink. Do with that what you will.
    */
    function getLinkInfo(basepath: string, title: string, hash: string, uri: string): {
        article: string;
        url: string;
    };
}
