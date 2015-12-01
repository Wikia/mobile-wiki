import App from '../app';

export default App.ImageReviewItemComponent = Ember.Component.extend({
    editorLayout: 'image-review-item',

    actions: {
        /**
         * @returns {void}
         */
        setOk() {
            this.sendAction('setImageAsOk', this.get('model.imageId'));
        },

        /**
         * @returns {void}
         */
        setQuestionable() {
            this.sendAction('setImageAsQuestionable', this.get('model.imageId'));
        },

        /**
         * @returns {void}
         */
        setDelete() {
            this.sendAction('setImageToDelete', this.get('model.imageId'));
        }
    }
});
