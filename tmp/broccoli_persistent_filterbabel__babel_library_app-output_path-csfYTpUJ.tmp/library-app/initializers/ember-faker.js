define('library-app/initializers/ember-faker', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() /* container, application */{
    // application.inject('route', 'foo', 'service:foo');
  };

  exports.default = {
    name: 'ember-faker',
    initialize: initialize
  };
});