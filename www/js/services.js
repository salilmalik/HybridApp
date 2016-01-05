angular
    .module('starter.services', [])

    .factory('CategoryService', [ '$http', function($http) {
      return {
        getCategories : getCategories
      };

      function getCategories() {
        return $http({
          method : 'GET',
          url : 'http://54.69.21.130/api/category'
        })
      }
      ;

    } ])
    .factory(
        'ProfileService',
        [
            '$http',
            function($http) {
              return {
                getProfileGoogle : getProfileGoogle,
                getProfileFacebook : getProfileFacebook
              };

              function getProfileGoogle(access_token) {
                return $http({
                  method : 'GET',
                  url : 'https://www.googleapis.com/plus/v1/people/me?access_token='
                      + access_token
                })
              }
              ;

              function getProfileFacebook(access_token) {
                console.log('access_token' + access_token);
                return $http({
                  method : 'GET',
                  url : 'https://graph.facebook.com/me?fields=name,email,gender,age_range,picture,location&access_token='
                      + access_token
                })
              }
              ;

            } ]).factory('UserService', [ '$http', function($http) {
      return {
        saveUserData : saveUserData
      };

      function saveUserData(user) {
        return $http({
          method : 'POST',
          url : 'http://54.69.21.130/api/user',
          data : user
        })
      }
      ;

    } ]).factory('QuestionService', [ '$http', function($http) {
      return {
        getQuestions : getQuestions
      };

      function getQuestions(categoryType) {
        return $http({
          method : 'GET',
          url : 'http://54.69.21.130/api/question/' + categoryType
        })
      }
      ;

    } ]).factory('$localstorage', [ '$window', function($window) {
      return {
        set : function(key, value) {
          $window.localStorage[key] = value;
        },
        get : function(key, defaultValue) {
          return $window.localStorage[key] || defaultValue;
        },
        setObject : function(key, value) {
          $window.localStorage[key] = JSON.stringify(value);
        },
        getObject : function(key) {
          if ($window.localStorage[key] === "undefined") {
            return {};
          } else {
            return JSON.parse($window.localStorage[key] || '{}');
          }
        }
      }
    } ]);
