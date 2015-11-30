import App from '../app';

export default App.ImageReviewItemComponent = Ember.Component.extend({
    editorLayout: 'image-review-item',

    actions: {
        /**
         * @param {ImageReviewItem} model
         * @returns {void}
         */
        setOk(model) {
			console.log("Setting image as ok! "+ model.imageId);
            this.sendAction('setImageAsOk', model);
        },

        /**
         * @param {ImageReviewItem} model
         * @returns {void}
         */
        setQuestionable(model) {
            this.sendAction('setImageAsQuestionable', model);
        },

        /**
         * @param {ImageReviewItem} model
         * @returns {void}
         */
        setDelete(model) {
            this.sendAction('setImageToDelete', model);
        }
    }
});
