App.ImageReviewItemComponent = Em.Component.extend({
    editorLayout: 'image-review-item',
	imageId: null,
	contractId: null,

    actions: {
        /**
         * @param {ImageReviewItem} model
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
