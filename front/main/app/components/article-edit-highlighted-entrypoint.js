import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['article-edit-highlighted-entrypoint'],
	classNameBindings: ['displayEdit'],
	displayEdit: Ember.computed('showEdit', function () {
		const showEdit = this.get('showEdit');

		let className = '';

		if (showEdit === true) {
			className = 'show-edit';
		} else if (showEdit === false) {
			className = 'hide-edit';
		}

		return className;
	}),
	actions: {
		editSection() {
			this.sendAction('edit', this.get('title'), this.get('section'), this.get('highlightedText'));
		}
	}
});
