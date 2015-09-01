'use strict';

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        // Watch Config
        watch: {
            files: ['views/**/*'],
            options: {
                livereload: true
            },
            css: {
                files: 'assets/styles/sass/*.scss',
                tasks: ['sass:dev'],
                options: {
                  livereload: true,
                }
            },
            scripts: {
                files: ['assets/scripts/src/*.js'],
                tasks: ['concat'],
            },
            express: {
                files:  [ 'index.js', '!**/node_modules/**', '!Gruntfile.js', 'requires/*.js' ],
                tasks:  [ 'express:dev' ],
                options: {
                    nospawn: true // Without this option specified express won't be reloaded
                }
            },
        },

        // Clean Config
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/*',
                        '!dist/.git*'
                    ]
                }]
            },
            server: ['.tmp'],
        },

        concat: {
          options: {
            // stripBanners: true
          },
          dist: {
            src: ['assets/scripts/src/*.js'],
            dest: 'assets/scripts/main.js'
          }
        },
        uglify: {
          options: {

          },
          dist: {
            src: '<%= concat.dist.dest %>',
            dest: 'assets/scripts/main.min.js'
          }
        },

        // Hint Config
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'assets/scripts/**/*.js',
                '!assets/scripts/vendor/*',
                'test/spec/**/*.js'
            ]
        },

        // Sass Config
        sass: {
          dev: {
            options: {
              style: 'expanded',
              compass: true
            },
            files: {
              'assets/styles/main.css': 'assets/styles/sass/main.scss'
            }
          },
          dist: {
            options: {
              style: 'compressed',
              compass: true
            },
            files: {
              'assets/styles/main.min.css': 'assets/styles/sass/main.scss'
            }
          }
        },

        // Express Config
        express: {
            options: {
              // Override defaults here
            },
            dev: {
                options: {
                    script: 'index.js'
                }
            }
        },

        // Open Config
        open: {
            site: {
                path: 'http://localhost:3000',
                app: 'Google Chrome'
            },
            editor: {
                path: './',
                app: 'Sublime Text'
            },
        },


        // Imagemin Config
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'assets/images',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: 'dist/assets/images'
                }]
            }
        },

        // SVGmin Config
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'assets/images',
                    src: '{,*/}*.svg',
                    dest: 'dist/assets/images'
                }]
            }
        },


    });

    // Register Tasks
    // Workon
    grunt.registerTask('workon', 'Start working on this project.', [
        'jshint',
        'sass:dev',
        'express:dev',
        'open:site',
        'open:editor',
        'watch'
    ]);


    // Restart
    grunt.registerTask('restart', 'Restart the server.', [
        'express:dev',
        'watch'
    ]);
    

    // Build
    grunt.registerTask('build', 'Build production ready assets and views.', [
        'clean:dist',
        'sass',
        'concat',
        'uglify',
    ]);

};
