define('library-app/components/library-item-form', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({
    buttonLabel: 'Save',

    actions: {
      buttonClicked: function buttonClicked(param) {
        this.sendAction('action', param);
      }
    }
  });
});