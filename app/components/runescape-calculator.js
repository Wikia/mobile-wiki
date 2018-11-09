import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

import { FetchError } from '../utils/errors';
import extend from '../utils/extend';

export default Component.extend({
  fetch: service(),
  wikiUrls: service(),
  wikiVariables: service(),

  tagName: 'form',

  config: computed('rawConfig', function () {
    return this.parseConfig(this.rawConfig.split('\n'));
  }),

  submit(event) {
    event.preventDefault();

    let code = '{{' + this.config.template;

    // TODO use DDAU
    // TODO add validation
    this.config.tParams.forEach((param) => {
      code += '|' + param.name + '=' + param.def;
    });

    code += '}}';

    this.load(code)
      .then((result) => {
        if (result) {
          this.set('result', result.parse.text['*']);
        }
      });
  },

  // Copy paste from mw.html.escape
  escapeHtml: (string) => {
    return string.replace(/['"<>&]/g, (char) => {
      switch (char) {
        case "'":
          return '&#039;';
        case '"':
          return '&quot;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
      }
    });
  },

  getComponentForParam: (type) => {
    if (type === 'hidden') {
      return null;
    } else if (type === 'fixed') {
      return 'runescape/param-fixed';
    } else if (type === 'select' ) {
      return 'runescape/param-select';
    } else if (type === 'check' ) {
      return 'runescape/param-check';
    } else if (type === 'hs' ) {
      return 'runescape/param-hs';
    } else {
      return 'runescape/param-def';
    }
  },

  /**
   * Parse the calculator configuration
   *
   * @param lines {Array} An array containing the calculator's configuration
   * @returns {Object} An object representing the calculator's configuration
   */
  parseConfig: function (lines) {
    const defConfig = {
      suggestns: []
    };

    let config = {
      // this isn't in `defConfig`
      // as it'll get overridden anyway
      tParams: []
    };

    // used for debugging incorrect config names
    const validParams = [
      'form',
      'param',
      'result',
      'suggestns',
      'template'
    ];

    // used for debugging incorrect param types
    const validParamTypes = [
      'string',
      'article',
      'number',
      'int',
      'select',
      'check',
      'hs',
      'fixed',
      'hidden',
      'semihidden'
    ];

    let configError = false;

    // parse the calculator's config
    // @example param=arg1|arg1|arg3|arg4
    lines.forEach((line) => {
      const temp = line.split('=');
      let param;
      let args;

      // incorrect config
      if (temp.length < 2) {
        return;
      }

      // an equals is used in one of the arguments
      // @example HTML label with attributes
      // so join them back together to preserve it
      // this also allows support of HTML attributes in labels
      if (temp.length > 2) {
        temp[1] = temp.slice(1, temp.length).join('=');
      }

      param = temp[0].trim().toLowerCase();
      args = temp[1].trim();

      if (validParams.indexOf(param) === -1) {
        // use console for easier debugging
        console.log('Unknown parameter: ' + param);
        configError = true;
        return;
      }

      if (param === 'suggestns') {
        config.suggestns = args.split(/\s*,\s*/);
        return;
      }

      if (param !== 'param') {
        config[param] = args;
        return;
      }

      // split args
      args = args.split(/\s*\|\s*/);

      // store template params in an array to make life easier
      config.tParams = config.tParams || [];

      if (validParamTypes.indexOf(args[3]) === -1 && args[3] !== '') {
        // use console for easier debugging
        console.log('Unknown param type: ' + args[3]);
        configError = true;
        return;
      }

      config.tParams.push({
        name: this.escapeHtml(args[0]),
        label: args[1] || args[0],
        def: this.escapeHtml(args[2] || ''),
        type: this.escapeHtml(args[3] || ''),
        range: this.escapeHtml(args[4] || ''),
        component: this.getComponentForParam(args[3] || '')
      });
    });

    if (configError) {
      config.configError = 'This calculator\'s config contains errors. Please report it ' +
        '<a href="/wiki/RuneScape:User_help" title="RuneScape:User help">here</a> ' +
        'or check the javascript console for details.';
    }

    config = extend(defConfig, config);
    return config;
  },

  load(code) {
    const url = this.wikiUrls.build({
      host: this.get('wikiVariables.host'),
      path: '/api.php',
      query: {
        action: 'parse',
        text: code,
        prop: 'text',
        title: this.config.template,
        disablepp: 'true',
        format: 'json'
      },
    });

    return this.fetch.fetchFromMediawiki(url, {}, FetchError);
  }
});
