import App from '../app';

export default App.ImageReviewController = Ember.Controller.extend({
	application: Ember.inject.controller(),

    init() {
        console.log("Image review init controller");
        this.setProperties({
            mainPageTitle: 'Image Review',
            siteName: 'Image Review'
        });
    }
});
