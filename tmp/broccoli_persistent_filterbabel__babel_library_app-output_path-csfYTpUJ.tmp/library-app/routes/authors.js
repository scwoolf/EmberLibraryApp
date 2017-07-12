define('library-app/routes/authors', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Route.extend({
    model: function model() {
      return this.store.findAll('author');
    },


    actions: {
      editAuthor: function editAuthor(author) {
        author.set('isEditing', true);
      },
      cancelAuthorEdit: function cancelAuthorEdit(author) {
        author.set('isEditing', false);
        author.rollbackAttributes();
      },
      saveAuthor: function saveAuthor(author) {

        if (author.get('isNotValid')) {
          return;
        }

        author.set('isEditing', false);
        author.save();
      }
    }
  });
});