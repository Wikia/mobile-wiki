/**
  * This is a mix of useful parts from:
  * - https://github.com/janmisek/ember-types
  * - https://github.com/janmisek/ember-error-handler
  */
import EmberObject, { computed } from '@ember/object';
import Ember from 'ember';

const { NAME_KEY } = Ember;
const unknownFunction = 'UnknownFunction';
const unknownObject = 'UnknownObject';

function stringify(value) {
  try {
    value = String(value);
  } catch (e) {
    value = 'unrecognized';
  }
  return value;
}

function extractClassName(subject) {
  return subject[NAME_KEY]
    || subject.modelName
    || subject.name
    || stringify(subject)
    || unknownFunction;
}

function extractInstanceName(subject) {
  return subject._debugContainerKey
    || subject.modelName
    || (subject.constructor ? extractClassName(subject.constructor) : false)
    || stringify(subject)
    || unknownObject;
}

function extractErrorName(subject) {
  if (typeof subject === 'function') {
    return `Class ${extractClassName(subject)}`;
  }
  return `Instance of ${extractInstanceName(subject)}`;
}

function getErrorName({ root = 'error' }, namesUsed) {
  let name;
  let index = 0;

  do {
    name = `${root}:${index}`;
    index += 1;
  } while (namesUsed.indexOf(name) !== -1);

  return name;
}

export default EmberObject.extend({
  error: null,

  normalizedName: computed(function () {
    const error = this.error;

    return extractErrorName(error) || String(error) || 'Unknown error';
  }),

  normalizedMessage: computed(function () {
    const error = this.error;

    if (typeof error === 'undefined') {
      return 'undefined thrown as error';
    }

    if (error === null) {
      return 'null thrown as error';
    }

    if (typeof error === 'boolean') {
      return `boolean thrown as error (${error ? 'true' : 'false'})`;
    }

    if (typeof error === 'string' || typeof error === 'number') {
      return error;
    }

    return error.message ? error.message : this.normalizedName;
  }),

  normalizedStack: computed(function () {
    let stack = this.get('error.stack');

    const parsed = (stack || '').replace(new RegExp('\\r', 'g'), '').split('\n');
    const message = this.normalizedMessage;

    const firstLine = parsed[0];
    const doesStackIncludeMessage = firstLine && firstLine.indexOf(message) !== -1;

    if (!doesStackIncludeMessage) {
      parsed[0] = parsed[0] ? `${parsed[0]}:` : parsed[0];
      parsed[0] += message;
      stack = parsed.join('\n');
    }

    return stack;
  }),

  additionalData: computed(function () {
    const collected = {};
    const namesUsed = [];

    let currentError = this.error;

    do {
      if (currentError && currentError.additionalData) {
        collected[getErrorName(currentError, namesUsed)] = currentError.additionalData;
      }

      currentError = currentError.previous;
    } while (currentError);

    return collected;
  }),
});
