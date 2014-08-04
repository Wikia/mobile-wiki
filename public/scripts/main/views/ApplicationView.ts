/// <reference path="../app.ts" />
'use strict';

App.ApplicationView = Em.View.extend({
	willInsertElement() {
		$('#app-container').html('');
	},

	click: function (event) {
		event.preventDefault();
	},

	mouseUp: function (event) {
		// debugger;
		var target,
			$closest,
			matches;

		// First, check if the target is an anchor
		if (event.target.tagName === 'A') {
			target = event.target;
		} else {
			/**
			 * If it isn't, check if the target has a parent that is an anchor
		 	 * We do this for links in the form <a href="...">Blah <i>Blah</i> Blah</a>,
		 	 * because if the user clicks the part of the link in the <i></i> then
		 	 * target.tagName will register as 'I' and not 'A'.
			 */
			$closest = Ember.$(event.target).closest('a');
			target = $closest.length ? $closest[0] : undefined;
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
	}
});
