/**
 * Created by YangShushuo on 2016/9/6 0006.
 */
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            options:{
                sourceMap: true
            },
            dist: {
                files:[{
                    expand: true,
                    cwd: 'style/sass/',
                    src: '*.sass',
                    dest: 'style/css/',
                    ext: '.css'
                }]
            }
        },
        jade: {
            compile:{
                options :{
                    data: {
                        debug: false
                    }
                },
                files: {
                    'html/index.html':'pug/index.pug'
                }
            }
        },
        prettify: {
            all: {
                expand: true,
                cwd: 'html/',
                ext: '.html',
                src: ['*.html'],
                dest: ''
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        jshint: {
            files: ['Gruntfile.js','src/**/*.js','test/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-prettify');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['sass','jade','jshint','prettify','uglify']);
};