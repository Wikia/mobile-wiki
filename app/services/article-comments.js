import Service, { inject as service } from '@ember/service';

export default Service.extend({
  currentUser: service(),
  wikiUrls: service(),
  wikiVariables: service(),
  i18n: service(),
  logger: service(),

  fetchI18n() {
    const i18nFilePath = `/mobile-wiki/assets/articleComments/${this.i18n.language}.json`;
    const enFilePath = '/mobile-wiki/assets/articleComments/en.json';

    return fetch(i18nFilePath)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        // if lang file was not found fallback to English
        return fetch(enFilePath)
          .then((fallback) => {
            if (fallback.ok) {
              return fallback.json();
            }

            throw new Error(`Article comments i18n file not found under ${i18nFilePath}`);
          });
      });
  },

  load({ title, id }) {
    window.fandomWebEditorPublicPath = '/mobile-wiki/assets/webEditor/';

    Promise.all([
      import('@fandom/article-comments'),
      /**
       * Dynamic import does not work here due to:
       * - https://github.com/ef4/ember-auto-import/issues/276
       * - https://github.com/ef4/ember-auto-import/issues/190
       *
       * Files are copied to respective directory
       * @see ember-cli-build.js
       */
      this.fetchI18n(),
    ]).then(([{ default: createComments }, i18n]) => {
      const user = {
        avatarUrl: this.currentUser.avatarPath,
        username: this.currentUser.name,
        token: '', // not needed, read only
        isAnon: false, // not needed, read only
        isBlocked: false, // not needed, read only
        canModerate: false, // not needed, read only
      };

      const env = {
        articleTitle: title,
        articleId: id,
        apiBaseUrl: this.wikiUrls.build({
          host: this.wikiVariables.host,
          path: '/wikia.php',
        }),
        userProfileBaseUrl: `${this.wikiUrls.build({ host: this.wikiVariables.host })}/User:`,
        isReadOnly: true,
      };

      createComments({
        env,
        user,
        i18n,
        container: document.getElementById('articleComments'),
      });
    }).catch((err) => {
      this.logger.error('Error while loading article comments', err);
    });
  },
});
