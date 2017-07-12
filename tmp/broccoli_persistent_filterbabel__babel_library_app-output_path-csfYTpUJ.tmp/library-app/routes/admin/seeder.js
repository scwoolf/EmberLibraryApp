define('library-app/routes/admin/seeder', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Route.extend({
    model: function model() {
      return _ember.default.RSVP.hash({
        libraries: this.store.findAll('library'),
        books: this.store.findAll('book'),
        authors: this.store.findAll('author')
      });
    },
    setupController: function setupController(controller, model) {
      controller.set('libraries', model.libraries);
      controller.set('books', model.books);
      controller.set('authors', model.authors);
    }
  });
});