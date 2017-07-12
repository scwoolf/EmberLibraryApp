define("library-app/templates/authors", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "iQFfVaVx", "block": "{\"statements\":[[0,\" \"],[11,\"h1\",[]],[13],[0,\"Authors\"],[14],[0,\"\\n\\n \"],[11,\"table\",[]],[15,\"class\",\"table table-bordered table-striped\"],[13],[0,\"\\n   \"],[11,\"thead\",[]],[13],[0,\"\\n   \"],[11,\"tr\",[]],[13],[0,\"\\n     \"],[11,\"th\",[]],[13],[0,\"\\n       Name\\n       \"],[11,\"br\",[]],[13],[14],[11,\"small\",[]],[15,\"class\",\"small not-bold\"],[13],[0,\"(Click on name for editing)\"],[14],[0,\"\\n     \"],[14],[0,\"\\n     \"],[11,\"th\",[]],[15,\"class\",\"vtop\"],[13],[0,\"Books\"],[14],[0,\"\\n   \"],[14],[0,\"\\n   \"],[14],[0,\"\\n   \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"     \"],[11,\"tr\",[]],[13],[0,\"\\n       \"],[11,\"td\",[]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"author\",\"isEditing\"]]],null,{\"statements\":[[0,\"           \"],[11,\"form\",[]],[15,\"class\",\"form-inline\"],[5,[\"action\"],[[28,[null]],\"saveAuthor\",[28,[\"author\"]]],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n             \"],[11,\"div\",[]],[15,\"class\",\"input-group\"],[13],[0,\"\\n               \"],[1,[33,[\"input\"],null,[[\"value\",\"class\"],[[28,[\"author\",\"name\"]],\"form-control\"]]],false],[0,\"\\n               \"],[11,\"div\",[]],[15,\"class\",\"input-group-btn\"],[13],[0,\"\\n                 \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn btn-success\"],[16,\"disabled\",[28,[\"author\",\"isNotValid\"]],null],[13],[0,\"Save\"],[14],[0,\"\\n                 \"],[11,\"button\",[]],[15,\"class\",\"btn btn-danger\"],[5,[\"action\"],[[28,[null]],\"cancelAuthorEdit\",[28,[\"author\"]]]],[13],[0,\"Cancel\"],[14],[0,\"\\n               \"],[14],[0,\"\\n             \"],[14],[0,\"\\n           \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"           \"],[11,\"span\",[]],[5,[\"action\"],[[28,[null]],\"editAuthor\",[28,[\"author\"]]]],[13],[1,[28,[\"author\",\"name\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"       \"],[14],[0,\"\\n       \"],[11,\"td\",[]],[13],[0,\"\\n         \"],[11,\"ul\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"author\",\"books\"]]],null,{\"statements\":[[0,\"             \"],[11,\"li\",[]],[13],[1,[28,[\"book\",\"title\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"book\"]},null],[0,\"         \"],[14],[0,\"\\n       \"],[14],[0,\"\\n     \"],[14],[0,\"\\n\"]],\"locals\":[\"author\"]},null],[0,\"   \"],[14],[0,\"\\n \"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "library-app/templates/authors.hbs" } });
});