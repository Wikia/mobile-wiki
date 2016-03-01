import Ember from 'ember';
import LanguagesMixin from '../mixins/languages';

export default Ember.Component.extend(
	LanguagesMixin,
	{
	classNames: ['article-edit-highlighted-entrypoint'],
	classNameBindings: ['displayEdit'],
	displayEdit: Ember.computed('showEdit', function () {
		const showEdit = this.get('showEdit');

		if (showEdit === true) {
			return 'show-edit';
		} else if (showEdit === false) {
			return 'hide-edit';
		}

		return '';
	}),
	actions: {
		editSection() {
			const title = this.get('title'),
				section = this.get('section'),
				highlightedText = this.get('highlightedText')

			if (this.get('editAllowed')) {
				this.sendAction('edit', title, section, highlightedText);
			} else {
				this.redirectToLogin(title, section, highlightedText);
			}
		}
	},

	redirectToLogin(title, section, highlightedText) {
		let redirect = `${window.location.origin}/wiki/edit/${title}/${section}`,
			href = '/join?redirect=';

		if (highlightedText) {
			redirect += '?highlighted=' + highlightedText;
		}

		href += `${encodeURIComponent(redirect)}${this.getUselangParam()}`;

		window.location.href = href;
	}
});
