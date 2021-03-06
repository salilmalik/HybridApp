// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter',
    [ 'ionic', 'starter.controllers', 'starter.services', 'ngCordova' ])

.run(
    function($ionicPlatform, $ionicPopup) {
      $ionicPlatform.ready(function() {
        // cordova plugin add org.apache.corova.network-information
      /*  if (window.Connection) {
          if (navigator.connection.type == Connection.NONE) {
            $ionicPopup.confirm({
              title : "Internet is not working",
              content : "Internet is not working on your device."
            });
          }
        }*/
        // Hide the accessory bar by default (remove this to show the
        // accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins
            && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });
    })

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url : '/tab',
    abstract : true,
    templateUrl : 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url : '/dash',
    views : {
      'tab-dash' : {
        templateUrl : 'templates/tab-dash.html',
        controller : 'DashCtrl'
      }
    }
  })

  .state('tab.questions', {
    cache : false,
    url : '/questions/:type',
    views : {
      'tab-questions' : {
        templateUrl : 'templates/tab-questions.html',
        controller : 'QuestionsCtrl'
      }
    }
  }).state('tab.points', {
    url : '/points/:param1/:param2/:param3',
    views : {
      'tab-points' : {
        templateUrl : 'templates/tab-points.html',
        controller : 'PointsCtrl'
      }
    }
  }).state('tab.profile', {
    cache : false,
    url : '/profile',
    views : {
      'tab-profile' : {
        templateUrl : 'templates/tab-profile.html',
        controller : 'ProfileCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
