/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../app.ts" />

'use strict';

// TS built-in MouseEvent's target is an EventTarget, not an HTMLElement
interface HTMLMouseEvent extends MouseEvent {
	target: HTMLElement;
}

interface DOMStringMap {
	galleryRef: string;
	ref: string;
	trackingCategory: string;
}

interface EventTarget {
	tagName: string;
}

App.ApplicationWrapperComponent = Em.Component.extend({
	classNameBindings: ['systemClass', 'smartBannerVisible', 'verticalClass'],

	verticalClass: Em.computed(function (): string {
		var vertical: string = Em.get(Mercury, 'wiki.vertical');
		return vertical + '-vertical';
	}),

	systemClass: Em.computed(function (): string {
		var system: string = Mercury.Utils.Browser.getSystem();
		return system ? 'system-' + system : '';
	}),

	noScroll: false,
	scrollLocation: null,
	smartBannerVisible: false,

	noScrollObserver: Em.observer('noScroll', function (): void {
		var $body = Em.$('body'),
			scrollLocation: number;

		if (this.get('noScroll')) {
			scrollLocation = $body.scrollTop();

			this.set('scrollLocation', scrollLocation);

			$body.css('top', -scrollLocation)
				.addClass('no-scroll');
		} else {
			$body.removeClass('no-scroll')
				.css('top', '');

			window.scrollTo(0, this.get('scrollLocation'));
			this.set('scrollLocation', null);
		}
	}),

	willInsertElement(): void {
		$('#preload').remove();
	},

	didInsertElement(): void {
		this.trackFirstContent();
	},

	trackFirstContent(): void {
		M.trackPerf({
			name: 'firstContent',
			type: 'mark'
		});
	},

	/**
	 * Necessary because presently, we open external links in new pages, so if we didn't
	 * cancel the click event on the current page, then the mouseUp handler would open
	 * the external link in a new page _and_ the current page would be set to that external link.
	 */
	click(event: MouseEvent): void {
		/**
		 * check if the target has a parent that is an anchor
		 * We do this for links in the form <a href='...'>Blah <i>Blah</i> Blah</a>,
		 * because if the user clicks the part of the link in the <i></i> then
		 * target.tagName will register as 'I' and not 'A'.
		 */
		var $anchor = Em.$(event.target).closest('a'),
			target: EventTarget = $anchor.length ? $anchor[0] : event.target,
			tagName: string;

		if (target && this.shouldHandleClick(target)) {
			tagName = target.tagName.toLowerCase();

			if (tagName === 'a') {
				this.handleLink(<HTMLAnchorElement>target);
				event.preventDefault();
			}
		}
	},

	/**
	 * Determine if we have to apply special logic to the click handler for MediaWiki / UGC content
	 */
	shouldHandleClick(target: EventTarget): boolean {
		var $target: JQuery = $(target),
			isReference: boolean = this.targetIsReference(target);

		return (
			$target.closest('.mw-content').length &&
			// ignore polldaddy content
			!$target.closest('.PDS_Poll').length &&
			// don't need special logic for article references
			!isReference
		);
	},

	/**
	 * Determine if the clicked target is an reference/in references list (in text or at the bottom of article)
	 */
	targetIsReference(target: EventTarget): boolean {
		var $target: JQuery = $(target);

		return !!(
			$target.closest('.references').length ||
			$target.parent('.reference').length
		);
	},

	handleLink(target: HTMLAnchorElement): void {
		Em.Logger.debug('Handling link with href:', target.href);

		/**
		 * If either the target or the target's parent is an anchor (and thus target == true),
		 * then also check if the anchor has an href. If it doesn't we assume there is some other
		 * handler for it that deals with it based on ID or something and we just skip it.
		 */
		if (target && target.href) {
			/**
			 * But if it does have an href, we check that it's not the link to expand the comments
			 * If it's _any_ other link than that comments link, we stop its action and
			 * pass it up to handleLink
			 */
			if (!target.href.match('^' + window.location.origin + '\/a\/.*\/comments$')) {
				this.sendAction('closeLightbox');
				this.sendAction('handleLink', target);
			}
		}
	}
});
