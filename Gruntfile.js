var fs = require('fs');
var livereload = require('connect-livereload');
var connect = require('connect');


module.exports = function(grunt) {

  grunt.initConfig({

    requirejs: {
      compile: {
        options: {
          name: '../lib/almond',
          include: 'main',
          out: 'main.js',
          baseUrl: 'src',
          keepBuildDir: true,
          inlineText: true,
          wrap: true,
          insertRequire: ['main'],
          mainConfigFile: 'src/main.js',
          stubModules: [
            'text'
          ]
        }
      }
    },

    clean: {
      build: [
        'Gruntfile.js',
        'src',
        'lib',
        'node_modules'
      ]
    },

   connect: {
      server: {
        options: {
          middleware: function(connect, options) {
            return [
              livereload(),
              connect.static(options.base),
              connect.directory(options.base)
            ];
          }
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      files: ['*', '*/*']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask('replaceRequireHtml', 'include src/main in index.html instead of lib/require.', function () {
    var input = fs.readFileSync('index.html', { encoding: 'utf8' });
    var output = input.replace('lib/require.js" data-main="src/main', 'main.js');
    fs.writeFileSync('index.html', output);
  });


  grunt.registerTask('build', ['requirejs', 'replaceRequireHtml', 'clean']);
  grunt.registerTask('default', ['connect', 'watch']);

};