// Type definitions for slick
// Project: http://kenwheeler.github.io/slick/
// Definitions by: kubosho_ <https://github.com/kubosho>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface JQuery {
	slick(opts?: SlickOptions): ISlick;
}

interface ISlick {
	slickCurrentSlide(): number;
	slickGoTo(slideNumber: number): ISlick;
	slickNext(): ISlick;
	slickPrev(): ISlick;
	slickPause(): ISlick;
	slickPlay(): ISlick;
	slickAdd(markup: any, addBefore?: boolean) : any;
	slickAdd(markup: any, index?: number, addBefore?: boolean) : any;
	slickRemove(removeBefore: boolean) : any;
	slickRemove(index: number, removeBefore?: boolean) : any;
	slickFilter(filter: any) : any;
	slickUnfilter(index: number) : any;
	slickGetOption(option: string) : any;
	slickSetOption(option: string, value: any, refresh?: boolean) : any;
	unslick() : any;
	getSlick(): ISlick;
}

interface SlickOptions {
	accessibility?: boolean;
	adaptiveHeight?: boolean;
	autoplay?: boolean;
	autoplaySpeed?: number;
	arrows?: boolean;
	asNavFor?: string;
	appendArrows?: string;
	prevArrow?: any; // string (html|jQuery selector) | object (DOM node|jQuery object)
	nextArrow?: any; // string (html|jQuery selector) | object (DOM node|jQuery object)
	centerMode?: boolean;
	centerPadding?: string;
	cssEase?: string;
	customPaging?: () => {};
	dots?: boolean;
	draggable?: boolean;
	fade?: boolean;
	focusOnSelect?: boolean;
	easing?: string;
	infinite?: boolean;
	initialSlide?: number;
	lazyLoad?: string;
	onBeforeChange?: () => {};
	onAfterChange?: () => {};
	onInit?: () => {};
	onReInit?: () => {};
	pauseOnHover?: boolean;
	pauseOnDotsHover?: boolean;
	responsive?: {};
	slide?: Element;
	slidesToShow?: number;
	slidesToScroll?: number;
	speed?: number;
	swipe?: boolean;
	swipeToSlide?: boolean;
	touchMove?: boolean;
	touchThreshold?: number;
	useCSS?: boolean;
	variableWidth?: boolean;
	vertical?: boolean;
	rtl?: boolean;
}

declare var Slick: ISlick;
