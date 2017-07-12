define('library-app/models/contact', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({

    email: _emberData.default.attr('string'),
    message: _emberData.default.attr('string'),

    isValidEmail: _ember.default.computed.match('email', /^.+@.+\..+$/),
    isMessageEnoughLong: _ember.default.computed.gte('message.length', 5),

    isValid: _ember.default.computed.and('isValidEmail', 'isMessageEnoughLong'),
    isNotValid: _ember.default.computed.not('isValid')
  });
});