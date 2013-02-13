/*
 * grunt-couchdb
 * https://github.com/ccowan/grunt-couchdb
 *
 * Copyright (c) 2013 Chris Cowan
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  var util = grunt.util || grunt.utils;
  var path = require('path');
  var nano = require('nano');
  var couchapp = require('couchapp');
  var _ = util._;
  var async = util.async;

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('couchdb', 'Manage CouchDB with Grunt.', function() {
    var destroy = grunt.option('destroy') || false;
    var done = this.async();
    var files = grunt.file.expand({}, this.data.designDocs);
    var db = this.data.db;
    var url = this.data.url;
    var client = nano(url);

    var tasks = [];

    if (destroy) {
      tasks.push(function (cb) {
        client.db.destroy(db, function (err) {
          if (!err) grunt.log.ok('Destroyed: '+db); 
          cb();
        });
      });
    }

    tasks.push(function (cb) {
      client.db.create(db, function (err) {
        if (!err) grunt.log.ok('Created: '+db);
        cb();
      });
    });

    if (files.length) {
      tasks.push(function (cb) {
        async.forEach(files, function (file, callback) {
          couchapp.createApp(require(path.join(process.env.PWD,file)), url+'/'+db, function(app) {
            app.push(callback);
          });
        }, function (err, results) {
          if (err) return cb(err);
          grunt.log.ok('App Created');
          cb();
        });
      });
    }

    async.series(tasks, function (err, results) {
      if (err) { 
        grunt.log.error(err.stack);
        return done();
      }
      done();
    });

  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('couchdb', function() {
    return 'couchdb!!!';
  });

};
