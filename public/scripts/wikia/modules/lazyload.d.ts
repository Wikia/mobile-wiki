/// <reference path="./thumbnailer.ts" />
/// <reference path="../../../../typings/jquery/jquery.d.ts" />

declare module Wikia.Modules {
    class LazyLoad {
        public pageContent: HTMLElement;
        public pageWidth: number;
        constructor();
        public onLoad(img: HTMLImageElement, background: boolean): () => void;
        static displayImage(img: HTMLImageElement, url: string, background: boolean): void;
        public load(elements: NodeList, background: boolean, media: any[]): void;
        public fixSizes(elements: NodeList): void;
    }
}
