import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		loadMore(type, offset) {
			const typeCapitalized = Ember.String.capitalize(type);

			this.set(`isLoading${typeCapitalized}`, true);
			this.get('loadMore')(type, offset).then(() => {
				this.set(`isLoading${typeCapitalized}`, false);
			});
		}
	}
});
