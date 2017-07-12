define('library-app/routes/admin/invitations', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Route.extend({
    model: function model() {
      return this.store.findAll('invitation');
    }
  });
});