angular
    .module('starter.controllers', [])
    .controller(
        'QuestionsCtrl',
        [
            '$scope',
            '$stateParams',
            'QuestionService',
            '$timeout',
            '$ionicModal',
            '$state',
            '$localstorage',
            function($scope, $stateParams, questionService,
                $timeout, $ionicModal, $state, $localstorage) {

              $scope.questions = {};
              $scope.nextQuestion = 0;
              $scope.question = '';
              $scope.answer = '';
              $scope.points = 0
              $scope.questionNumber = -1;
              $scope.total = 0;
              $scope.correct = 0;
              $scope.isAlreadyAnswered = false;
              $scope.imageSrc = 'img/ionic.png';
              $ionicModal.fromTemplateUrl('image-modal.html', {
                scope : $scope,
                animation : 'slide-in-up'
              }).then(function(modal) {
                $scope.modal = modal;
              });
              $scope.openModal = function() {
                $scope.modal.show();
              };
              $scope.closeModal = function() {
                $scope.modal.hide();
              };
              $scope.$on('$destroy', function() {
                $scope.modal.remove();
              });
              $scope.$on('modal.hide', function() {
              });
              $scope.$on('modal.removed', function() {
              });
              $scope.$on('modal.shown', function() {
                console.log('Modal is shown!');
              });
              resetColor();
              getQuestions();
              function resetColor() {
                $scope.buttonColorOptionA = 'button button-positive';
                $scope.buttonColorOptionB = 'button button-positive';
                $scope.buttonColorOptionC = 'button button-positive';
                $scope.buttonColorOptionD = 'button button-positive';
              }
              function getQuestions() {
                questionService
                    .getQuestions($stateParams.type)
                    .success(
                        function(data) {
                          $scope.questions = data;
                          console
                              .log("$scope.questions:asdsad"
                                  + $scope.questions);
                          $localstorage
                              .setObject(
                                  $stateParams.type
                                      + 'Questions',
                                  $scope.questions);
                          getNextQuestion(++$scope.questionNumber);
                        })
                    .error(
                        function(data, status) {
                          $scope.questions = $localstorage
                              .getObject($stateParams.type
                                  + 'Questions');
                          if (JSON
                              .stringify($scope.questions) == '{}') {
                            $scope.noQuestions = 'Internet is closed. Cannot fetch questions for this category';
                          } else {
                            getNextQuestion(++$scope.questionNumber);
                          }
                        });
              }
              $scope.checkAnswer = function(userAnswer, x) {
                if (userAnswer === $scope.answer) {
                  $scope.correct++;
                  rightAnswerColor($scope.answer);
                  playAnimation(1);
                  updatePoints(20);
                } else {
                  wrongAnswerColor(userAnswer);
                  rightAnswerColor($scope.answer);
                  playAnimation(2);
                  updatePoints(-5);
                }
                $scope.isAlreadyAnswered = true;
                $timeout(function() {
                  getNextQuestion(++$scope.questionNumber);
                }, 1500);
              }
              function rightAnswerColor(answer) {
                if ($scope.optionA === answer) {
                  $scope.buttonColorOptionA = 'button button-balanced';
                } else if ($scope.optionB === answer) {
                  $scope.buttonColorOptionB = 'button button-balanced';
                } else if ($scope.optionC === answer) {
                  $scope.buttonColorOptionC = 'button button-balanced';
                } else if ($scope.optionD === answer) {
                  $scope.buttonColorOptionD = 'button button-balanced';
                }

              }
              function wrongAnswerColor(userAnswer) {
                if ($scope.optionA === userAnswer) {
                  $scope.buttonColorOptionA = 'button button-assertive';
                } else if ($scope.optionB === userAnswer) {
                  $scope.buttonColorOptionB = 'button button-assertive';
                } else if ($scope.optionC === userAnswer) {
                  $scope.buttonColorOptionC = 'button button-assertive';
                } else if ($scope.optionD === userAnswer) {
                  $scope.buttonColorOptionD = 'button button-assertive';
                }

              }
              function getNextQuestion(n) {
                $scope.isAlreadyAnswered = false;
                if ($scope.questions.length > n) {
                  $scope.total++;
                  resetColor();
                  var questionOptions = $scope.questions[n].quest
                      .split('/');
                  $scope.question = questionOptions[0].trim();
                  $scope.optionA = questionOptions[1].trim();
                  $scope.optionB = questionOptions[2].trim();
                  $scope.optionC = questionOptions[3].trim();
                  $scope.optionD = questionOptions[4].trim();
                  $scope.answer = $scope.questions[n].answer
                      .trim();
                } else {
                  $state.go('tab.points', {
                    param1 : $scope.correct,
                    param2 : $scope.total,
                    param3 : $scope.points
                  });
                }
              }
              ;
              function playAnimation(isCorrect) {
                if (isCorrect === 1) {
                  $scope.imageSrc = 'img/right.png';
                } else {
                  $scope.imageSrc = 'img/wrong.png';
                }

                $scope.openModal();
                $timeout(function() {
                  $scope.modal.hide();
                }, 1000);
              }
              function updatePoints(points) {
                if (!$scope.isAlreadyAnswered) {
                  $scope.points += points;
                }
              }

            }

        ])
    .controller(
        'DashCtrl',
        [
            '$scope',
            'CategoryService',
            '$state',
            '$localstorage',
            '$rootScope',
            '$cordovaNetwork',
            function($scope, categoryService, $state,
                $localstorage, $rootScope, $cordovaNetwork) {
              $scope.categories = {};
              $scope.color = {};
              $scope.color = [ '{default}', '{light}',
                  '{stable}', '{positive}', '{calm}',
                  '{balanced}', '{energized}', '{assertive}',
                  '{royal}', '{dark}' ];
              document
                  .addEventListener(
                      "deviceready",
                      function() {
                        var type = $cordovaNetwork
                            .getNetwork()
                        var isOnline = $cordovaNetwork
                            .isOnline()
                        var isOffline = $cordovaNetwork
                            .isOffline()
                        // listen for Online event
                        $rootScope
                            .$on(
                                '$cordovaNetwork:online',
                                function(event,
                                    networkState) {
                                  var onlineState = networkState;
                                  $scope.noCategory = '';
                                  getCategories();
                                })

                        // listen for Offline event
                        $rootScope
                            .$on(
                                '$cordovaNetwork:offline',
                                function(event,
                                    networkState) {
                                  var offlineState = networkState;
                                })

                      }, false);
              getCategories();
              function getCategories() {
                categoryService
                    .getCategories()
                    .success(
                        function(data) {
                          $scope.categories = data;
                          $localstorage.setObject(
                              'categories',
                              $scope.categories);
                        })
                    .error(
                        function(data, status) {
                          $scope.categories = $localstorage
                              .getObject('categories');
                          if (JSON
                              .stringify($scope.categories) == '{}') {
                            $scope.noCategory = 'Internet is closed. Cannot fetch categories';
                          }
                        });
              }

            } ])
    .controller('PointsCtrl', function($scope, $stateParams, Chats) {
      $scope.correct = $stateParams.param1;
      $scope.total = $stateParams.param2;
      $scope.points = $stateParams.param3;
    })
    .controller(
        'ProfileCtrl',
        function($scope, $window, $state, $cordovaOauth,
            ProfileService, UserService, $localstorage) {
          $scope.isAuthenticated = false;
          var user = {};
          var user = $localstorage.getObject('user');
          if (user.name === undefined) {

          } else {
            $scope.isAuthenticated = true;
            $scope.email = user.email;
            $scope.name = user.name;
            $scope.imageURL = user.imageURL;
          }
          $scope.googleLogin = function() {
            $cordovaOauth
                .google(
                    "108857563401-15qrp97fnjh1b6p5ka8jk8qvg36fquff.apps.googleusercontent.com",
                    [ "email" ])
                .then(
                    function(result) {
                      $scope.access_token = result.access_token;
                      ProfileService
                          .getProfileGoogle(
                              $scope.access_token)
                          .success(
                              function(data) {
                                user.name = data.displayName;
                                user.email = data.emails[0].value;
                                user.imageURL = data.image.url
                                saveUserData(user);
                              });
                    }, function(error) {
                    });
          }
          function saveUserData(user) {
            UserService.saveUserData(user).success(function(data) {
              $scope.userID = data.objectId;
              $localstorage.setObject('user', user);
              $state.go($state.current, {}, {
                reload : true
              });
            });
          }
          $scope.facebookLogin = function() {
            $cordovaOauth
                .facebook(
                    "970456633001810",
                    [ "email", "public_profile",
                        "user_friends" ])
                .then(
                    function(result) {
                      $scope.access_token = result.access_token;
                      ProfileService
                          .getProfileFacebook(
                              $scope.access_token)
                          .success(
                              function(data) {
                                user.name = data.name;
                                user.email = data.email;
                                user.imageURL = data.picture.data.url;
                                saveUserData(user);
                              });
                    }, function(error) {
                    });
          }
          $scope.logout = function() {
            $localstorage.setObject('user', undefined);
            $scope.isAuthenticated = false;
            $state.go($state.current, {}, {
              reload : true
            });
          }
        });
