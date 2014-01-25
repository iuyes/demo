/*
 * demo
 * https://github.com/crossjs/demo
 *
 * Copyright (c) 2014 crossjs
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['src/*.js'],
      options: {
        jshintrc: true
      }
    },

    qunit: {
      all: ['test/*.html']
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        options: {
          paths: 'src',
          outdir: 'doc',
          themedir: 'vendor/yuidoc-bootstrap'
        }
      }
    },

    clean: {
      build: {
        files: {
          src: ['.build']
        }
      },
      dist: {
        files: {
          src: ['dist/**']
        }
      }
    },

    transport: {
      options: {
        debug: true,
        idleading: '../dist/',
        alias: '<%= pkg.spm.alias %>'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.js'],
          dest: '.build/',
          ext: '.js'
        }]
      }
    },

    concat: {
      options: {
        debug: true,
        include: 'all',
        paths: ['sea-modules']
      },
      src: {
        files: [{
          expand: true,
          cwd: '.build/',
          src: ['*.js'],
          dest: 'dist/',
          ext: '.js'
        }]
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
        beautify: {
          'ascii_only': true
        },
        // mangle: true,
        compress: {
          'global_defs': {
            'DEBUG': false
          },
          'dead_code': true
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['*.js', '!*-debug.js'],
          dest: 'dist/',
          ext: '.js'
        }]
      }
    }

  });

  grunt.registerTask('build', ['clean', 'transport', 'concat', 'uglify', 'clean:build']);

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['test', 'build']);

};
