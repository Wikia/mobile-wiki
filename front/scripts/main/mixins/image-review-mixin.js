import App from '../app';

export default App.ImageReviewMixin = Ember.Mixin.create({

	renderTemplate(controller, model) {
		this.render('image-review', {
			controller: controller,
			model: model
		});
	}
});
