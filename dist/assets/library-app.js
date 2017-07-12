"use strict";



define('library-app/adapters/application', ['exports', 'emberfire/adapters/firebase'], function (exports, _firebase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebase.default.extend({});
});
define('library-app/app', ['exports', 'ember', 'library-app/resolver', 'ember-load-initializers', 'library-app/config/environment'], function (exports, _ember, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = void 0;

  _ember.default.MODEL_FACTORY_INJECTIONS = true;

  App = _ember.default.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('library-app/components/fader-label', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({
    tagName: 'span',

    classNames: ['label label-success label-fade'],
    classNameBindings: ['isShowing:label-show'],

    isShowing: false,

    isShowingChanged: _ember.default.observer('isShowing', function () {
      var _this = this;

      _ember.default.run.later(function () {
        return _this.set('isShowing', false);
      }, 3000);
    })
  });
});
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
define('library-app/components/library-item', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({});
});
define('library-app/components/nav-link-to', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.LinkComponent.extend({
    tagName: 'li'
  });
});
define('library-app/components/number-box', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Component.extend({

    classNames: ['panel', 'panel-warning']

  });
});
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
define('library-app/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
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
define('library-app/controllers/index', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Controller.extend({

    headerMessage: 'Coming Soon',
    responseMessage: '',
    emailAddress: '',

    isValid: _ember.default.computed.match('emailAddress', /^.+@.+\..+$/),
    isDisabled: _ember.default.computed.not('isValid'),

    actions: {
      saveInvitation: function saveInvitation() {
        var _this = this;

        var email = this.get('emailAddress');

        var newInvitation = this.store.createRecord('invitation', { email: email });
        newInvitation.save().then(function (response) {
          _this.set('responseMessage', 'Thank you! We saved your email address with the following id: ' + response.get('id'));
          _this.set('emailAddress', '');
        });
      }
    }
  });
});
define('library-app/helpers/app-version', ['exports', 'ember', 'library-app/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = _ember.default.Helper.helper(appVersion);
});
define('library-app/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('library-app/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('library-app/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'library-app/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _config$APP = _environment.default.APP,
      name = _config$APP.name,
      version = _config$APP.version;
  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('library-app/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('library-app/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('library-app/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/index'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('library-app/initializers/ember-faker', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() /* container, application */{
    // application.inject('route', 'foo', 'service:foo');
  };

  exports.default = {
    name: 'ember-faker',
    initialize: initialize
  };
});
define('library-app/initializers/emberfire', ['exports', 'emberfire/initializers/emberfire'], function (exports, _emberfire) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberfire.default;
});
define('library-app/initializers/export-application-global', ['exports', 'ember', 'library-app/config/environment'], function (exports, _ember, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember.default.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('library-app/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('library-app/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('library-app/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("library-app/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('library-app/models/author', ['exports', 'ember-data', 'ember', 'faker'], function (exports, _emberData, _ember, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({

    name: _emberData.default.attr('string'),
    books: _emberData.default.hasMany('book', { inverse: 'author', async: true }),

    isNotValid: _ember.default.computed.empty('name'),

    randomize: function randomize() {
      this.set('name', _faker.default.name.findName());
      return this;
    }
  });
});
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
define('library-app/models/invitation', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    email: _emberData.default.attr('string')
  });
});
define('library-app/models/library', ['exports', 'ember-data', 'ember', 'faker'], function (exports, _emberData, _ember, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({

    name: _emberData.default.attr('string'),
    address: _emberData.default.attr('string'),
    phone: _emberData.default.attr('string'),

    books: _emberData.default.hasMany('book', { inverse: 'library', async: true }),

    isValid: _ember.default.computed.notEmpty('name'),

    randomize: function randomize() {
      this.set('name', _faker.default.company.companyName() + ' Library');
      this.set('address', this._fullAddress());
      this.set('phone', _faker.default.phone.phoneNumber());

      // If you would like to use in chain.
      return this;
    },
    _fullAddress: function _fullAddress() {
      return _faker.default.address.streetAddress() + ', ' + _faker.default.address.city();
    }
  });
});
define('library-app/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
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
define('library-app/routes/about', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Route.extend({});
});
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
define('library-app/routes/books', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Route.extend({});
});
define('library-app/routes/contact', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Route.extend({
    model: function model() {
      return this.store.createRecord('contact');
    },


    actions: {
      sendMessage: function sendMessage(newContactMessage) {
        var _this = this;

        newContactMessage.save().then(function () {
          return _this.controller.set('responseMessage', true);
        });
      },
      willTransition: function willTransition() {
        var model = this.controller.get('model');

        if (model.get('isNew')) {
          model.destroyRecord();
        }

        this.controller.set('responseMessage', false);
      }
    }
  });
});
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
define('library-app/routes/libraries/index', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Route.extend({
    model: function model() {
      return this.store.findAll('library');
    },


    actions: {
      deleteLibrary: function deleteLibrary(library) {
        var confirmation = confirm('Are you sure?');

        if (confirmation) {
          library.destroyRecord();
        }
      }
    }

  });
});
define('library-app/routes/libraries/new', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.Route.extend({

    model: function model() {
      return this.store.createRecord('library');
    },

    setupController: function setupController(controller, model) {
      this._super(controller, model);

      controller.set('title', 'Create a new library');
      controller.set('buttonLabel', 'Create');
    },

    renderTemplate: function renderTemplate() {
      this.render('libraries/form');
    },


    actions: {
      saveLibrary: function saveLibrary(newLibrary) {
        var _this = this;

        newLibrary.save().then(function () {
          return _this.transitionTo('libraries');
        });
      },
      willTransition: function willTransition() {
        var model = this.controller.get('model');

        if (model.get('isNew')) {
          model.destroyRecord();
        }
      }
    }
  });
});
define('library-app/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('library-app/services/firebase-app', ['exports', 'emberfire/services/firebase-app'], function (exports, _firebaseApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebaseApp.default;
});
define('library-app/services/firebase', ['exports', 'emberfire/services/firebase'], function (exports, _firebase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebase.default;
});
define("library-app/templates/about", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "xU6jQjqh", "block": "{\"statements\":[[11,\"h1\",[]],[13],[0,\"About Page\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/about.hbs" } });
});
define("library-app/templates/admin/invitations", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "MAERoWrc", "block": "{\"statements\":[[11,\"h1\",[]],[13],[0,\"Invitations\"],[14],[0,\"\\n\\n\"],[11,\"table\",[]],[15,\"class\",\"table table-bordered table-striped\"],[13],[0,\"\\n  \"],[11,\"thead\",[]],[13],[0,\"\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"ID\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"E-mail\"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"th\",[]],[13],[1,[28,[\"invitation\",\"id\"]],false],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[1,[28,[\"invitation\",\"email\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"invitation\"]},null],[0,\"  \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/admin/invitations.hbs" } });
});
define("library-app/templates/admin/seeder", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "CHwDfuWA", "block": "{\"statements\":[[11,\"h1\",[]],[13],[0,\"Seeder, our Data Center\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"row\"],[13],[0,\"\\n \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[1,[33,[\"number-box\"],null,[[\"title\",\"number\"],[\"Libraries\",[28,[\"libraries\",\"length\"]]]]],false],[14],[0,\"\\n \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[1,[33,[\"number-box\"],null,[[\"title\",\"number\"],[\"Authors\",[28,[\"authors\",\"length\"]]]]],false],[14],[0,\"\\n \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[1,[33,[\"number-box\"],null,[[\"title\",\"number\"],[\"Books\",[28,[\"books\",\"length\"]]]]],false],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[1,[33,[\"seeder-block\"],null,[[\"sectionTitle\",\"generateAction\",\"deleteAction\",\"generateReady\",\"deleteReady\",\"generateInProgress\",\"deleteInProgress\"],[\"Libraries\",\"generateLibraries\",\"deleteLibraries\",[28,[\"libDone\"]],[28,[\"libDelDone\"]],[28,[\"generateLibrariesInProgress\"]],[28,[\"deleteLibrariesInProgress\"]]]]],false],[0,\"\\n\\n\"],[1,[33,[\"seeder-block\"],null,[[\"sectionTitle\",\"generateAction\",\"deleteAction\",\"generateReady\",\"deleteReady\",\"generateInProgress\",\"deleteInProgress\"],[\"Authors with Books\",\"generateBooksAndAuthors\",\"deleteBooksAndAuthors\",[28,[\"authDone\"]],[28,[\"authDelDone\"]],[28,[\"generateBooksInProgress\"]],[28,[\"deleteBooksInProgress\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/admin/seeder.hbs" } });
});
define("library-app/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "fApDDojQ", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"container\"],[13],[0,\"\\n  \"],[19,\"navbar\"],[0,\"\\n  \"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":true}", "meta": { "moduleName": "library-app/templates/application.hbs" } });
});
define("library-app/templates/authors", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "iQFfVaVx", "block": "{\"statements\":[[0,\" \"],[11,\"h1\",[]],[13],[0,\"Authors\"],[14],[0,\"\\n\\n \"],[11,\"table\",[]],[15,\"class\",\"table table-bordered table-striped\"],[13],[0,\"\\n   \"],[11,\"thead\",[]],[13],[0,\"\\n   \"],[11,\"tr\",[]],[13],[0,\"\\n     \"],[11,\"th\",[]],[13],[0,\"\\n       Name\\n       \"],[11,\"br\",[]],[13],[14],[11,\"small\",[]],[15,\"class\",\"small not-bold\"],[13],[0,\"(Click on name for editing)\"],[14],[0,\"\\n     \"],[14],[0,\"\\n     \"],[11,\"th\",[]],[15,\"class\",\"vtop\"],[13],[0,\"Books\"],[14],[0,\"\\n   \"],[14],[0,\"\\n   \"],[14],[0,\"\\n   \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"     \"],[11,\"tr\",[]],[13],[0,\"\\n       \"],[11,\"td\",[]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"author\",\"isEditing\"]]],null,{\"statements\":[[0,\"           \"],[11,\"form\",[]],[15,\"class\",\"form-inline\"],[5,[\"action\"],[[28,[null]],\"saveAuthor\",[28,[\"author\"]]],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n             \"],[11,\"div\",[]],[15,\"class\",\"input-group\"],[13],[0,\"\\n               \"],[1,[33,[\"input\"],null,[[\"value\",\"class\"],[[28,[\"author\",\"name\"]],\"form-control\"]]],false],[0,\"\\n               \"],[11,\"div\",[]],[15,\"class\",\"input-group-btn\"],[13],[0,\"\\n                 \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn btn-success\"],[16,\"disabled\",[28,[\"author\",\"isNotValid\"]],null],[13],[0,\"Save\"],[14],[0,\"\\n                 \"],[11,\"button\",[]],[15,\"class\",\"btn btn-danger\"],[5,[\"action\"],[[28,[null]],\"cancelAuthorEdit\",[28,[\"author\"]]]],[13],[0,\"Cancel\"],[14],[0,\"\\n               \"],[14],[0,\"\\n             \"],[14],[0,\"\\n           \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"           \"],[11,\"span\",[]],[5,[\"action\"],[[28,[null]],\"editAuthor\",[28,[\"author\"]]]],[13],[1,[28,[\"author\",\"name\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"       \"],[14],[0,\"\\n       \"],[11,\"td\",[]],[13],[0,\"\\n         \"],[11,\"ul\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"author\",\"books\"]]],null,{\"statements\":[[0,\"             \"],[11,\"li\",[]],[13],[1,[28,[\"book\",\"title\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"book\"]},null],[0,\"         \"],[14],[0,\"\\n       \"],[14],[0,\"\\n     \"],[14],[0,\"\\n\"]],\"locals\":[\"author\"]},null],[0,\"   \"],[14],[0,\"\\n \"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/authors.hbs" } });
});
define("library-app/templates/books", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "xbhqnP2Q", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/books.hbs" } });
});
define("library-app/templates/components/fader-label", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "IXcdEvNU", "block": "{\"statements\":[[18,\"default\"],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/components/fader-label.hbs" } });
});
define("library-app/templates/components/library-item-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "3BRjzzgP", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"form-horizontal\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[16,\"class\",[34,[\"form-group has-feedback \",[33,[\"if\"],[[28,[\"item\",\"isValid\"]],\"has-success\"],null]]]],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Name*\"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"item\",\"name\"]],\"form-control\",\"The name of the Library\"]]],false],[0,\"\\n          \"],[6,[\"if\"],[[28,[\"item\",\"isValid\"]]],null,{\"statements\":[[11,\"span\",[]],[15,\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[13],[14]],\"locals\":[]},null],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Address\"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"item\",\"address\"]],\"form-control\",\"The address of the Library\"]]],false],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Phone\"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"item\",\"phone\"]],\"form-control\",\"The phone number of the Library\"]]],false],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"col-sm-offset-2 col-sm-10\"],[13],[0,\"\\n            \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn btn-default\"],[16,\"disabled\",[33,[\"unless\"],[[28,[\"item\",\"isValid\"]],true],null],null],[5,[\"action\"],[[28,[null]],\"buttonClicked\",[28,[\"item\"]]]],[13],[1,[26,[\"buttonLabel\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/components/library-item-form.hbs" } });
});
define("library-app/templates/components/library-item", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Jl7noX6H", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"panel panel-default library-item\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"panel-heading\"],[13],[0,\"\\n        \"],[11,\"h3\",[]],[15,\"class\",\"panel-title\"],[13],[1,[28,[\"item\",\"name\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"panel-body\"],[13],[0,\"\\n        \"],[11,\"p\",[]],[13],[0,\"Address: \"],[1,[28,[\"item\",\"address\"]],false],[14],[0,\"\\n        \"],[11,\"p\",[]],[13],[0,\"Phone: \"],[1,[28,[\"item\",\"phone\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"panel-footer text-right\"],[13],[0,\"\\n      \"],[18,\"default\"],[0,\"\\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/components/library-item.hbs" } });
});
define("library-app/templates/components/nav-link-to", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "rWR3RamM", "block": "{\"statements\":[[11,\"a\",[]],[15,\"href\",\"\"],[13],[18,\"default\"],[14]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/components/nav-link-to.hbs" } });
});
define("library-app/templates/components/number-box", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "gSydsc9r", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"panel-heading\"],[13],[0,\"\\n  \"],[11,\"h3\",[]],[15,\"class\",\"text-center\"],[13],[1,[26,[\"title\"]],false],[14],[0,\"\\n  \"],[11,\"h1\",[]],[15,\"class\",\"text-center\"],[13],[1,[33,[\"if\"],[[28,[\"number\"]],[28,[\"number\"]],\"...\"],null],false],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/components/number-box.hbs" } });
});
define("library-app/templates/components/seeder-block", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "LnEYEpIb", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"well well-sm extra-padding-bottom\"],[13],[0,\"\\n  \"],[11,\"h3\",[]],[13],[1,[26,[\"sectionTitle\"]],false],[14],[0,\"\\n  \\n  \"],[11,\"div\",[]],[15,\"class\",\"form-inline\"],[13],[0,\"\\n  \\n   \"],[11,\"div\",[]],[16,\"class\",[34,[\"form-group has-feedback \",[33,[\"unless\"],[[28,[\"isCounterValid\"]],\"has-error\"],null]]]],[13],[0,\"\\n     \"],[11,\"label\",[]],[15,\"class\",\"control-label\"],[13],[0,\"Number of new records:\"],[14],[0,\"\\n     \"],[1,[33,[\"input\"],null,[[\"value\",\"class\",\"placeholder\"],[[28,[\"counter\"]],\"form-control\",[28,[\"placeholder\"]]]]],false],[0,\"\\n   \"],[14],[0,\"\\n  \\n   \"],[11,\"button\",[]],[15,\"class\",\"btn btn-primary\"],[16,\"disabled\",[26,[\"generateIsDisabled\"]],null],[5,[\"action\"],[[28,[null]],\"generateAction\"]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"generateInProgress\"]]],null,{\"statements\":[[0,\"       \"],[11,\"span\",[]],[15,\"class\",\"glyphicon glyphicon-refresh spinning\"],[13],[14],[0,\" Generating...\\n\"]],\"locals\":[]},{\"statements\":[[0,\"       Generate \"],[1,[26,[\"sectionTitle\"]],false],[0,\"\\n\"]],\"locals\":[]}],[0,\"   \"],[14],[0,\"\\n   \"],[6,[\"fader-label\"],null,[[\"isShowing\"],[[28,[\"generateReady\"]]]],{\"statements\":[[0,\"Created!\"]],\"locals\":[]},null],[0,\"\\n  \\n   \"],[11,\"button\",[]],[15,\"class\",\"btn btn-danger\"],[16,\"disabled\",[26,[\"deleteIsDisabled\"]],null],[5,[\"action\"],[[28,[null]],\"deleteAction\"]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"deleteInProgress\"]]],null,{\"statements\":[[0,\"       \"],[11,\"span\",[]],[15,\"class\",\"glyphicon glyphicon-refresh spinning\"],[13],[14],[0,\" Deleting...\\n\"]],\"locals\":[]},{\"statements\":[[0,\"       Delete All \"],[1,[26,[\"sectionTitle\"]],false],[0,\"\\n\"]],\"locals\":[]}],[0,\"   \"],[14],[0,\"\\n   \"],[6,[\"fader-label\"],null,[[\"isShowing\"],[[28,[\"deleteReady\"]]]],{\"statements\":[[0,\"Deleted!\"]],\"locals\":[]},null],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/components/seeder-block.hbs" } });
});
define("library-app/templates/contact", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Nk3g9yXq", "block": "{\"statements\":[[0,\"\\n\"],[11,\"h1\",[]],[13],[0,\"Contact Page\"],[14],[0,\"\\n\\n\"],[11,\"p\",[]],[15,\"class\",\"well well-sm\"],[13],[0,\"If you have any question or feedback please leave a message with your email address.\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"row\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-md-6\"],[13],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"responseMessage\"]]],null,{\"statements\":[[0,\"\\n        \"],[11,\"br\",[]],[13],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"alert alert-success\"],[13],[0,\"\\n            \"],[11,\"h4\",[]],[13],[0,\"Thank you! Your message is sent.\"],[14],[0,\"\\n            \"],[11,\"p\",[]],[13],[0,\"To: \"],[1,[28,[\"model\",\"email\"]],false],[14],[0,\"\\n            \"],[11,\"p\",[]],[13],[0,\"Message: \"],[1,[28,[\"model\",\"message\"]],false],[14],[0,\"\\n            \"],[11,\"p\",[]],[13],[0,\"Reference ID: \"],[1,[28,[\"model\",\"id\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[0,\"\\n        \"],[11,\"div\",[]],[16,\"class\",[34,[\"form-group has-feedback \",[33,[\"if\"],[[28,[\"model\",\"isValidEmail\"]],\"has-success\"],null]]]],[13],[0,\"\\n            \"],[11,\"label\",[]],[13],[0,\"Your email address*:\"],[14],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"class\",\"placeholder\",\"value\",\"autofocus\"],[\"email\",\"form-control\",\"Your email address\",[28,[\"model\",\"email\"]],\"autofocus\"]]],false],[0,\"\\n          \"],[6,[\"if\"],[[28,[\"model\",\"isValidEmail\"]]],null,{\"statements\":[[11,\"span\",[]],[15,\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[13],[14]],\"locals\":[]},null],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[16,\"class\",[34,[\"form-group has-feedback \",[33,[\"if\"],[[28,[\"model\",\"isMessageEnoughLong\"]],\"has-success\"],null]]]],[13],[0,\"\\n            \"],[11,\"label\",[]],[13],[0,\"Your message*:\"],[14],[0,\"\\n          \"],[1,[33,[\"textarea\"],null,[[\"class\",\"placeholder\",\"rows\",\"value\"],[\"form-control\",\"Your message. (At least 5 characters.)\",\"5\",[28,[\"model\",\"message\"]]]]],false],[0,\"\\n          \"],[6,[\"if\"],[[28,[\"model\",\"isMessageEnoughLong\"]]],null,{\"statements\":[[11,\"span\",[]],[15,\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[13],[14]],\"locals\":[]},null],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"btn btn-success\"],[16,\"disabled\",[28,[\"model\",\"isNotValid\"]],null],[5,[\"action\"],[[28,[null]],\"sendMessage\",[28,[\"model\"]]]],[13],[0,\"Send\"],[14],[0,\"\\n\\n\"]],\"locals\":[]}],[0,\"\\n    \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/contact.hbs" } });
});
define("library-app/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Ath24cLz", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"jumbotron text-center\"],[13],[0,\"\\n   \"],[11,\"h1\",[]],[13],[0,\"Coming Soon\"],[14],[0,\"\\n\\n   \"],[11,\"br\",[]],[13],[14],[11,\"br\",[]],[13],[14],[0,\"\\n\\n   \"],[11,\"p\",[]],[13],[0,\"Don't miss our launch date, request an invitation now.\"],[14],[0,\"\\n\\n   \"],[11,\"div\",[]],[15,\"class\",\"form-horizontal form-group form-group-lg row\"],[13],[0,\"\\n     \"],[11,\"div\",[]],[15,\"class\",\"col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-1 col-md-5 col-md-offset-2\"],[13],[0,\"\\n       \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\",\"autofocus\"],[\"email\",[28,[\"emailAddress\"]],\"form-control\",\"Please type your e-mail address.\",\"autofocus\"]]],false],[0,\"\\n     \"],[14],[0,\"\\n     \"],[11,\"div\",[]],[15,\"class\",\"col-xs-10 col-xs-offset-1 col-sm-offset-0 col-sm-4 col-md-3\"],[13],[0,\"\\n       \"],[11,\"button\",[]],[15,\"class\",\"btn btn-primary btn-lg btn-block\"],[16,\"disabled\",[26,[\"isDisabled\"]],null],[5,[\"action\"],[[28,[null]],\"saveInvitation\"]],[13],[0,\"Request invitation\"],[14],[0,\"\\n     \"],[14],[0,\"\\n   \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"responseMessage\"]]],null,{\"statements\":[[0,\"     \"],[11,\"div\",[]],[15,\"class\",\"alert alert-success\"],[13],[1,[26,[\"responseMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n   \"],[11,\"br\",[]],[13],[14],[11,\"br\",[]],[13],[14],[0,\"\\n\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/index.hbs" } });
});
define("library-app/templates/libraries", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "B0h2Kaaf", "block": "{\"statements\":[[11,\"h1\",[]],[13],[0,\"Libraries\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"well\"],[13],[0,\"\\n  \"],[11,\"ul\",[]],[15,\"class\",\"nav nav-pills\"],[13],[0,\"\\n    \"],[6,[\"link-to\"],[\"libraries.index\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[11,\"a\",[]],[15,\"href\",\"\"],[13],[0,\"List all\"],[14]],\"locals\":[]},null],[0,\"\\n    \"],[6,[\"link-to\"],[\"libraries.new\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[11,\"a\",[]],[15,\"href\",\"\"],[13],[0,\"Add new\"],[14]],\"locals\":[]},null],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[1,[26,[\"outlet\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/libraries.hbs" } });
});
define("library-app/templates/libraries/edit", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "5FyG7Ndm", "block": "{\"statements\":[[11,\"h2\",[]],[13],[0,\"Edit Library\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"row\"],[13],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"col-md-6\"],[13],[0,\"\\n    \"],[1,[33,[\"library-item-form\"],null,[[\"item\",\"buttonLabel\",\"action\"],[[28,[\"model\"]],\"Save changes\",\"saveLibrary\"]]],false],[0,\"\\n  \"],[14],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[0,\"\\n\"],[6,[\"library-item\"],null,[[\"item\"],[[28,[\"model\"]]]],{\"statements\":[[0,\"      \"],[11,\"br\",[]],[13],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[14],[0,\"\\n\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/libraries/edit.hbs" } });
});
define("library-app/templates/libraries/form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "vLnoRoE+", "block": "{\"statements\":[[11,\"h2\",[]],[13],[1,[26,[\"title\"]],false],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"row\"],[13],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"col-md-6\"],[13],[0,\"\\n    \"],[1,[33,[\"library-item-form\"],null,[[\"item\",\"buttonLabel\",\"action\"],[[28,[\"model\"]],[28,[\"buttonLabel\"]],\"saveLibrary\"]]],false],[0,\"\\n  \"],[14],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[0,\"\\n\"],[6,[\"library-item\"],null,[[\"item\"],[[28,[\"model\"]]]],{\"statements\":[[0,\"      \"],[11,\"br\",[]],[13],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[14],[0,\"\\n\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/libraries/form.hbs" } });
});
define("library-app/templates/libraries/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "CSHWrE9B", "block": "{\"statements\":[[11,\"h2\",[]],[13],[0,\"List\"],[14],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"row\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[0,\"\\n\"],[6,[\"library-item\"],null,[[\"item\"],[[28,[\"library\"]]]],{\"statements\":[[0,\"        \"],[6,[\"link-to\"],[\"libraries.edit\",[28,[\"library\",\"id\"]]],[[\"class\"],[\"btn btn-success btn-xs\"]],{\"statements\":[[0,\"Edit\"]],\"locals\":[]},null],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"btn btn-danger btn-xs\"],[5,[\"action\"],[[28,[null]],\"deleteLibrary\",[28,[\"library\"]]]],[13],[0,\"Delete\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n\"]],\"locals\":[\"library\"]},null],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/libraries/index.hbs" } });
});
define("library-app/templates/libraries/new", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "J5n1lJPb", "block": "{\"statements\":[[11,\"h2\",[]],[13],[0,\"Add a new local Library\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"row\"],[13],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"col-md-6\"],[13],[0,\"\\n    \"],[1,[33,[\"library-item-form\"],null,[[\"item\",\"buttonLabel\",\"action\"],[[28,[\"model\"]],\"Add to library list\",\"saveLibrary\"]]],false],[0,\"\\n  \"],[14],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[0,\"\\n\"],[6,[\"library-item\"],null,[[\"item\"],[[28,[\"model\"]]]],{\"statements\":[[0,\"      \"],[11,\"br\",[]],[13],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[14],[0,\"\\n\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/libraries/new.hbs" } });
});
define("library-app/templates/navbar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "en6TLjFa", "block": "{\"statements\":[[11,\"nav\",[]],[15,\"class\",\"navbar navbar-inverse\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"container-fluid\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"navbar-header\"],[13],[0,\"\\n      \"],[11,\"button\",[]],[15,\"type\",\"button\"],[15,\"class\",\"navbar-toggle collapsed\"],[15,\"data-toggle\",\"collapse\"],[15,\"data-target\",\"#main-navbar\"],[13],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"sr-only\"],[13],[0,\"Toggle navigation\"],[14],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"icon-bar\"],[13],[14],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"icon-bar\"],[13],[14],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"icon-bar\"],[13],[14],[0,\"\\n      \"],[14],[0,\"\\n      \"],[6,[\"link-to\"],[\"index\"],[[\"class\"],[\"navbar-brand\"]],{\"statements\":[[0,\"Library App\"]],\"locals\":[]},null],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"collapse navbar-collapse\"],[15,\"id\",\"main-navbar\"],[13],[0,\"\\n      \"],[11,\"ul\",[]],[15,\"class\",\"nav navbar-nav\"],[13],[0,\"\\n        \"],[6,[\"nav-link-to\"],[\"index\"],null,{\"statements\":[[0,\"Home\"]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"nav-link-to\"],[\"libraries\"],null,{\"statements\":[[0,\"Libraries\"]],\"locals\":[]},null],[0,\"\\n\\t\\t\"],[6,[\"nav-link-to\"],[\"authors\"],null,{\"statements\":[[0,\"Authors\"]],\"locals\":[]},null],[0,\"\\n\\t\\t\"],[6,[\"nav-link-to\"],[\"books\"],null,{\"statements\":[[0,\"Books\"]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"nav-link-to\"],[\"about\"],null,{\"statements\":[[0,\"About\"]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"nav-link-to\"],[\"contact\"],null,{\"statements\":[[0,\"Contact\"]],\"locals\":[]},null],[0,\"\\n      \"],[14],[0,\"\\n\\n      \"],[11,\"ul\",[]],[15,\"class\",\"nav navbar-nav navbar-right\"],[13],[0,\"\\n        \"],[11,\"li\",[]],[15,\"class\",\"dropdown\"],[13],[0,\"\\n          \"],[11,\"a\",[]],[15,\"class\",\"dropdown-toggle\"],[15,\"data-toggle\",\"dropdown\"],[15,\"role\",\"button\"],[15,\"aria-haspopup\",\"true\"],[15,\"aria-expanded\",\"false\"],[13],[0,\"\\n            Admin\"],[11,\"span\",[]],[15,\"class\",\"caret\"],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"ul\",[]],[15,\"class\",\"dropdown-menu\"],[13],[0,\"\\n            \"],[6,[\"nav-link-to\"],[\"admin.invitations\"],null,{\"statements\":[[0,\"Invitations\"]],\"locals\":[]},null],[0,\"\\n            \"],[6,[\"nav-link-to\"],[\"admin.contacts\"],null,{\"statements\":[[0,\"Contacts\"]],\"locals\":[]},null],[0,\"\\n            \"],[6,[\"nav-link-to\"],[\"admin.seeder\"],null,{\"statements\":[[0,\"Seeder\"]],\"locals\":[]},null],[0,\"\\n          \"],[14],[0,\"\\n        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[4,\" /.navbar-collapse \"],[0,\"\\n  \"],[14],[4,\" /.container-fluid \"],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/navbar.hbs" } });
});
define('library-app/torii-providers/firebase', ['exports', 'emberfire/torii-providers/firebase'], function (exports, _firebase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebase.default;
});


define('library-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'library-app';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("library-app/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true,"name":"library-app","version":"0.0.0+0528a011"});
}
//# sourceMappingURL=library-app.map
