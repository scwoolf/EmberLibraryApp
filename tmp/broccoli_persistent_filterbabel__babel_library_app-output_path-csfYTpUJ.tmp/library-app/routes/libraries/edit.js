define('library-app/routes/libraries/edit', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Route.extend({
    model: function model(params) {
      return this.store.findRecord('library', params.library_id);
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);

      controller.set('title', 'Edit library');
      controller.set('buttonLabel', 'Save changes');
    },
    renderTemplate: function renderTemplate() {
      this.render('libraries/form');
    },


    actions: {
      saveLibrary: function saveLibrary(library) {
        var _this = this;

        library.save().then(function () {
          return _this.transitionTo('libraries');
        });
      },
      willTransition: function willTransition(transition) {
        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");

          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        }
      }
    }
  });
});