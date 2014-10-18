'use strict';
module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      '/Users/KillEmAll/Documents/components/angular/angular.js',
      '/Users/KillEmAll/Documents/components/angular-route/angular-route.js',
      '/Users/KillEmAll/Documents/components/angular-resource/angular-resource.js',
      '/Users/KillEmAll/Documents/components/angular-mocks/angular-mocks.js',
      '*.js'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      '/Users/KillEmAll/Documents/gameLogic.js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    autoWatch : true,
    
    logLevel: config.LOG_DEBUG,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
