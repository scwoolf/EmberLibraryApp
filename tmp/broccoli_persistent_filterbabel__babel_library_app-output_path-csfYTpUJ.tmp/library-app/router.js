define('library-app/router', ['exports', 'ember', 'library-app/config/environment'], function (exports, _ember, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = _ember.default.Router.extend({
    location: _environment.default.locationType
  });

  Router.map(function () {
    this.route('about');
    this.route('contact');

    this.route('admin', function () {
      this.route('invitations');
      this.route('contacts');
      this.route('seeder');
    });

    this.route('libraries', function () {
      this.route('new');
      this.route('edit', { path: '/:library_id/edit' });
    });
    this.route('authors');
    this.route('books');
  });

  exports.default = Router;
});