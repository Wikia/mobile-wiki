/// <reference path="../app.ts" />
'use strict';

// TS built-in MouseEvent's target is an EventTarget, not an HTMLElement
interface HTMLMouseEvent extends MouseEvent {
	target: HTMLElement;
}

App.ApplicationView = Em.View.extend({
	/**
	 * Store scroll location so when we set the body to fixed position, we can set its
	 * top, and also so we can scroll back to where it was before we fixed it.
	 * @type int
	 */
	scrollLocation: null,

	willInsertElement: function() {
		$('#app-container').html('');
	},

	/**
	 * Necessary because presently, we open external links in new pages, so if we didn't
	 * cancel the click event on the current page, then the mouseUp handler would open
	 * the external link in a new page _and_ the current page would be set to that external link.
	 */
	click: function (event: MouseEvent): void {
		event.preventDefault();
	},

	mouseUp: function (event: HTMLMouseEvent): void {
		var target: HTMLAnchorElement,
			$closest: JQuery,
			matches: Array<string>;

		// First, check if the target is an anchor
		if (event.target.tagName === 'A') {
			// If it is, we can coerce its type
			target = <HTMLAnchorElement>event.target;
		} else {
			/**
			 * If it isn't, check if the target has a parent that is an anchor
		 	 * We do this for links in the form <a href="...">Blah <i>Blah</i> Blah</a>,
		 	 * because if the user clicks the part of the link in the <i></i> then
		 	 * target.tagName will register as 'I' and not 'A'.
			 */
			$closest = Em.$(event.target).closest('a');
			target = $closest.length ? <HTMLAnchorElement>$closest[0] : undefined;
		}

		/**
		 * If either the target or the target's parent is an anchor (and thus target == true),
		 * then also check if the anchor has an href. If it doesn't we assume there is some other
		 * handler for it that deals with it based on ID or something and we just skip it.
		 */
		if (target && target.href) {
			matches = target.href.match(window.location.origin + '(.*)');
			/**
			 * But if it does have an href, we check that it's not the link to expand the comments
			 * If it's _any_ other link than that comments link, we stop its action and
			 * pass it up to handleLink
			 */
			if (!target.href.match('^' + window.location.origin + '\/a\/.*\/comments$')) {
				event.preventDefault();
				this.get('controller').send('handleLink', target);
			}
		}
	},

	actions: {
		setScrollable: function () {
			var $body = Em.$('body');
			$body.removeClass('no-scroll');
			$body.css('top', '');
			window.scrollTo(0, this.get('scrollLocation'));
			this.set('scrollLocation', null);
		},

		setUnScrollable: function () {
			var $body = Em.$('body'),
				scrollLocation = $body.scrollTop();
			this.set('scrollLocation', scrollLocation);
			$body.css('top', -scrollLocation);
			$body.addClass('no-scroll');
		}
	}
});
