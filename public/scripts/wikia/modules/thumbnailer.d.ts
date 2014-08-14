declare module W {
    class Thumbnailer {
        private static extRegExp;
        private static imagePath;
        private static thumbPath;
        static isThumbUrl(url: string): boolean;
        static clearThumbOptions(url: string): string;
        static switchPathTo(url: string, type: string): string;
        static getThumbURL(url?: string, type?: string, width?: string, height?: string): string;
        static getImageURL(url: string): string;
    }
}
