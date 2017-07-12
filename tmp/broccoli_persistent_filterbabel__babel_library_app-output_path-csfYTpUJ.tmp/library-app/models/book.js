define('library-app/models/book', ['exports', 'ember-data', 'faker'], function (exports, _emberData, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({

    title: _emberData.default.attr('string'),
    releaseYear: _emberData.default.attr('date'),

    author: _emberData.default.belongsTo('author', { inverse: 'books', async: true }),
    library: _emberData.default.belongsTo('library', { inverse: 'books', async: true }),

    randomize: function randomize(author, library) {
      this.set('title', this._bookTitle());
      this.set('author', author);
      this.set('releaseYear', this._randomYear());
      this.set('library', library);

      return this;
    },
    _bookTitle: function _bookTitle() {
      return _faker.default.commerce.productName() + ' Cookbook';
    },
    _randomYear: function _randomYear() {
      return new Date(this._getRandomArbitrary(1900, 2015).toPrecision(4));
    },
    _getRandomArbitrary: function _getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
  });
});