interface Window {
    scrollY: number;
}
declare module Wikia.Modules {
    class Branch {
        private element;
        private threshold;
        public callback: Function;
        constructor(element: HTMLElement, threshold: number, callback: Function);
        public isVisible(visibleBottom: number, visibleTop: number): boolean;
        public compare(element: HTMLElement): boolean;
    }
    class Sloth {
        public wTop: number;
        public wBottom: number;
        public undef: any;
        public branches: Branch[];
        public lock: number;
        public addEvent(): void;
        public removeEvent(): void;
        public drop(): void;
        public execute(force?: boolean): void;
        public attach(params: any): void;
    }
}
