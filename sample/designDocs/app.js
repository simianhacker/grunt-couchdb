var ddoc = module.exports = {
  _id: '_design/app',
  views: {},
  lists: {},
  shows: {}
};

ddoc.views.usersFriends = {
  map: function (doc) {
    for(var i = 0; i < doc.friends; i++) {
      var id = doc.friends[i];
      emit(id, 1);
    }
  },
  reduce: '_sum'
};
