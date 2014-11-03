//Type definitions for headroom.js v0.7.0

interface HeadroomOptions {
	offset?: number;
	tolerance?: any;
	classes?: {
		initial?: string;
		pinned?: string;
		unpinned?: string;
		top?: string;
		notTop?: string;
	};
	scroller?: Element;
	onPin?: () => void;
	onUnPin?: () => void;
	onTop?: () => void;
	onNotTop?: () => void;

}

declare class Headroom {
	constructor(element: Element, options: HeadroomOptions);
	init: () => void;
}
