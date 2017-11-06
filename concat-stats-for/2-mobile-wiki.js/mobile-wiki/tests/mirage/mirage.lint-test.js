define('mobile-wiki/tests/mirage/mirage.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | mirage');

  QUnit.test('mirage/config.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/config.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/fixtures/curated-content-editor-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/fixtures/curated-content-editor-item.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/fixtures/curated-content-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/fixtures/curated-content-section.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/fixtures/curated-content.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/fixtures/curated-content.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/fixtures/file-page.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/fixtures/file-page.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/fixtures/search.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/fixtures/search.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/curated-content-editor-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/curated-content-editor-item.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/curated-content-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/curated-content-section.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/curated-content.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/curated-content.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/models/search.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/models/search.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/application.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/curated-content-editor-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/curated-content-editor-item.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/curated-content-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/curated-content-section.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/curated-content.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/curated-content.js should pass ESLint\n\n');
  });

  QUnit.test('mirage/serializers/search.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mirage/serializers/search.js should pass ESLint\n\n');
  });
});