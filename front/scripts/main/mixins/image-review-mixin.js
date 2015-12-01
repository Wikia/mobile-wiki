import App from '../app';

export default App.ImageReviewMixin = Ember.Mixin.create({

	renderTemplate(controller, model) {
		console.log("Image review renderTemplate called!");
		this.render('image-review', {
			controller: controller,
			model: model
		});
	}
});
