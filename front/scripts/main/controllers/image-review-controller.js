import App from '../app';

//Disclaimer: I'm not sure whether in current architecture of ImageReview it's necessary to have controller
//I guess it's not
export default App.ImageReviewController = Ember.Controller.extend({
	application: Ember.inject.controller(),

    init() {
        this.setProperties({
            mainPageTitle: 'Image Review',
            siteName: 'Image Review'
        });
    }
});
