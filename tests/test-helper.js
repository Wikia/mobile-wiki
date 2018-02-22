import Application from '../app';
import config from '../config/environment';
import {setApplication} from '@ember/test-helpers';
import {start} from 'ember-qunit';
import startApp from 'mobile-wiki/tests/helpers/start-app';

setApplication(Application.create(config.APP));

start();
startApp();
