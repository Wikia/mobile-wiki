export default Ember.Component.extend(
	{
		canShowMore: Ember.computed('model.postCount', 'model.replies.length', function () {
			const model = this.get('model');

			return model.get('replies.length') < model.get('postCount');
		}),
		
		actions: {

		},
	}
);




