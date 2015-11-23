App.ImageReviewItemComponent = Em.Component.extend({
    editorLayout: 'image-review-item',

    actions: {
        /**
         * @param {CuratedContentEditorModel} model
         * @returns {void}
         */
        setOk(model) {
            this.sendAction('ok', model);
        },

        /**
         * @param {CuratedContentEditorModel} model
         * @returns {void}
         */
        setQuestionable(model) {
            this.sendAction('q', model);
        },

        /**
         * @param {CuratedContentEditorModel} model
         * @returns {void}
         */
        setDelete(model) {
            this.sendAction('delete', model);
        }
    }
});