import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import {mockTrackClickMixin} from './helpers/mock-mixins';

setResolver(resolver);

// @todo XW-1235
mockTrackClickMixin();
