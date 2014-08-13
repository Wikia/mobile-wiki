/// <reference path="../app.d.ts" />
interface Response {
    payload: {
        article: string;
        user: any;
        media: any[];
        users: any[];
        categories: any[];
    };
    articleTitle: string;
    articleDetails: {
        revision: {
            timestamp: number;
        };
        comments: any;
        id: number;
        ns: string;
        title: string;
    };
    relatedPages: {
        items: any[];
    };
    userDetails: {
        items: any[];
    };
}
