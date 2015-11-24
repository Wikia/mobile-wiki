App.MainPageController = Em.Controller.extend({
    application: Em.inject.controller(),

    init() {
        this.setProperties({
            mainPageTitle: 'Image Review',
            siteName: 'Image Review'
        });
    }
});