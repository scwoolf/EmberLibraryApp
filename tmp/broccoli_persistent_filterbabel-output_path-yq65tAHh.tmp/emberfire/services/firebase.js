define('emberfire/services/firebase', ['exports', 'firebase', 'ember'], function (exports, _firebase, _ember) {
  var getOwner = _ember['default'].getOwner;
  exports['default'] = {
    create: function create(application) {
      var config = getOwner(application).resolveRegistration('config:environment');
      if (!config || typeof config.firebase !== 'object') {
        throw new Error('Please set the `firebase` property in your environment config.');
      }

      var app = undefined;

      try {
        app = _firebase['default'].app();
      } catch (e) {
        app = _firebase['default'].initializeApp(config.firebase);
      }

      return app.database().ref();
    },

    config: null,
    isServiceFactory: true
  };
});