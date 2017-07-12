define('library-app/controllers/admin/seeder', ['exports', 'ember', 'faker'], function (exports, _ember, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Controller.extend({

    // If you haven't mapped this properties in setupController, you can alias them here
    libraries: _ember.default.computed.alias('model.libraries'),
    books: _ember.default.computed.alias('model.books'),
    authors: _ember.default.computed.alias('model.authors'),

    actions: {
      generateLibraries: function generateLibraries(volume) {
        var _this = this;

        // Progress flag, data-down to seeder-block where our lovely button will show a spinner...
        this.set('generateLibrariesInProgress', true);

        var counter = parseInt(volume);
        var savedLibraries = [];

        for (var i = 0; i < counter; i++) {

          // Collect all Promise in an array
          savedLibraries.push(this._saveRandomLibrary());
        }

        // Wait for all Promise to fulfill so we can show our label and turn off the spinner.
        _ember.default.RSVP.all(savedLibraries).then(function () {
          _this.set('generateLibrariesInProgress', false);
          _this.set('libDone', true);
        });
      },
      deleteLibraries: function deleteLibraries() {
        var _this2 = this;

        // Progress flag, data-down to seeder-block button spinner.
        this.set('deleteLibrariesInProgress', true);

        // Our local _destroyAll return a promise, we change the label when all records destroyed.
        this._destroyAll(this.get('libraries'))

        // Data down via seeder-block to fader-label that we ready to show the label.
        // Change the progress indicator also, so the spinner can be turned off.
        .then(function () {
          _this2.set('libDelDone', true);
          _this2.set('deleteLibrariesInProgress', false);
        });
      },
      generateBooksAndAuthors: function generateBooksAndAuthors(volume) {
        var _this3 = this;

        // Progress flag, data-down to seeder-block button spinner.
        this.set('generateBooksInProgress', true);

        var counter = parseInt(volume);
        var booksWithAuthors = [];

        for (var i = 0; i < counter; i++) {

          // Collect Promises in an array.
          var books = this._saveRandomAuthor().then(function (newAuthor) {
            return _this3._generateSomeBooks(newAuthor);
          });
          booksWithAuthors.push(books);
        }

        // Let's wait until all async save resolved, show a label and turn off the spinner.
        _ember.default.RSVP.all(booksWithAuthors)

        // Data down via seeder-block to fader-label that we ready to show the label
        // Change the progress flag also, so the spinner can be turned off.
        .then(function () {
          _this3.set('authDone', true);
          _this3.set('generateBooksInProgress', false);
        });
      },
      deleteBooksAndAuthors: function deleteBooksAndAuthors() {
        var _this4 = this;

        // Progress flag, data-down to seeder-block button to show spinner.
        this.set('deleteBooksInProgress', true);

        var authors = this.get('authors');
        var books = this.get('books');

        // Remove authors first and books later, finally show the label.
        this._destroyAll(authors).then(function () {
          return _this4._destroyAll(books);
        })

        // Data down via seeder-block to fader-label that we ready to show the label
        // Delete is finished, we can turn off the spinner in seeder-block button.
        .then(function () {
          _this4.set('authDelDone', true);
          _this4.set('deleteBooksInProgress', false);
        });
      }
    },

    // Private methods

    // Create a new library record and uses the randomizator, which is in our model and generates some fake data in
    // the new record. After we save it, which is a promise, so this returns a promise.
    _saveRandomLibrary: function _saveRandomLibrary() {
      return this.store.createRecord('library').randomize().save();
    },
    _saveRandomAuthor: function _saveRandomAuthor() {
      return this.store.createRecord('author').randomize().save();
    },
    _generateSomeBooks: function _generateSomeBooks(author) {
      var _this5 = this;

      var bookCounter = _faker.default.random.number(10);
      var books = [];

      var _loop = function _loop(j) {
        var library = _this5._selectRandomLibrary();

        // Creating and saving book, saving the related records also are take while, they are all a Promise.
        var bookPromise = _this5.store.createRecord('book').randomize(author, library).save().then(function () {
          return author.save();
        })

        // guard library in case if we don't have any
        .then(function () {
          return library && library.save();
        });
        books.push(bookPromise);
      };

      for (var j = 0; j < bookCounter; j++) {
        _loop(j);
      }

      // Return a Promise, so we can manage the whole process on time
      return _ember.default.RSVP.all(books);
    },
    _selectRandomLibrary: function _selectRandomLibrary() {

      // Please note libraries are records from store, which means this is a DS.RecordArray object, it is extended from
      // Ember.ArrayProxy. If you need an element from this list, you cannot just use libraries[3], we have to use
      // libraries.objectAt(3)
      var libraries = this.get('libraries');
      var size = libraries.get('length');

      // Get a random number between 0 and size-1
      var randomItem = _faker.default.random.number(size - 1);
      return libraries.objectAt(randomItem);
    },
    _destroyAll: function _destroyAll(records) {

      // destroyRecord() is a Promise and will be fulfilled when the backend database is confirmed the delete
      // lets collect these Promises in an array
      var recordsAreDestroying = records.map(function (item) {
        return item.destroyRecord();
      });

      // Wrap all Promise in one common Promise, RSVP.all is our best friend in this process. ;)
      return _ember.default.RSVP.all(recordsAreDestroying);
    }
  });
});