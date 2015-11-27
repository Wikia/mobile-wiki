App.ImageReviewItemComponent = Em.Component.extend({
    editorLayout: 'image-review-item',

    actions: {
        /**
         * @param {CuratedContentEditorModel} model
         * @returns {void}
         */
        setOk(model) {
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
