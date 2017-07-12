define('library-app/components/seeder-block', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var MAX_VALUE = 100;

  exports.default = _ember.default.Component.extend({

    counter: null,

    isCounterValid: _ember.default.computed.lte('counter', MAX_VALUE),
    isCounterNotValid: _ember.default.computed.not('isCounterValid'),
    placeholder: 'Max ' + MAX_VALUE,

    generateReady: false,
    deleteReady: false,

    generateInProgress: false,
    deleteInProgress: false,

    generateIsDisabled: _ember.default.computed.or('isCounterNotValid', 'generateInProgress', 'deleteInProgress'),
    deleteIsDisabled: _ember.default.computed.or('generateInProgress', 'deleteInProgress'),

    actions: {
      generateAction: function generateAction() {
        if (this.get('isCounterValid')) {

          // Action up to Seeder Controller with the requested amount
          this.sendAction('generateAction', this.get('counter'));
        }
      },
      deleteAction: function deleteAction() {
        this.sendAction('deleteAction');
      }
    }
  });
});