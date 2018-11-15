import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend(
  {
    i18n: service(),

    classNames: ['category-alphabet-shortcuts'],
    tagName: 'ul',

    shortcuts: computed('from', function () {
      const shortcuts = [
        {
          from: null,
          // Doesn't make sense to always highlight it on the first page
          isActive: false,
          label: '#',
        },
      ];

      // Latin chars
      Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i))
        .forEach((latinChar) => {
          shortcuts.push({
            from: latinChar,
            isActive: this.from === latinChar,
            label: latinChar,
          });
        });

      shortcuts.push({
        from: '¡',
        isActive: this.from === '¡',
        label: this.i18n.t('category-page.shortcut-to-other'),
      });

      return shortcuts;
    }),
  },
);
