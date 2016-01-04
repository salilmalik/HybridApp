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
            function($scope, $stateParams, questionService,
                $timeout, $ionicModal, $state) {
              $scope.questions = {};
              $scope.nextQuestion = 0;
              $scope.question = '';
              $scope.answer = '';
              $scope.points = 0
              $scope.questionNumber = -1;
              $scope.total = 0;
              $scope.correct = 0;
              $scope.isAlreadyAnswered = false;
              $scope.imageSrc = 'http://ionicframework.com/img/ionic-logo-blog.png';
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

              // Cleanup the modal when we're done with it!
              $scope.$on('$destroy', function() {
                $scope.modal.remove();
              });
              // Execute action on hide modal
              $scope.$on('modal.hide', function() {
                // Execute action
              });
              // Execute action on remove modal
              $scope.$on('modal.removed', function() {
                // Execute action
              });
              $scope.$on('modal.shown', function() {
                console.log('Modal is shown!');
              });

              /* $cordovaNativeAudio.play('yes'); */
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
                          getNextQuestion(++$scope.questionNumber);
                        });
              }
              $scope.checkAnswer = function(userAnswer, x) {
                console.log(userAnswer);
                console.log($scope.answer);
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
                // getNextQuestion(++$scope.questionNumber);

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
                  console.log("QUESTION "
                      + $scope.questions[n].quest);
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

                console.log(isCorrect);
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
            function($scope, categoryService) {
              $scope.categories = {};
              $scope.color = {};
              $scope.color = [ '{default}', '{light}',
                  '{stable}', '{positive}', '{calm}',
                  '{balanced}', '{energized}', '{assertive}',
                  '{royal}', '{dark}' ];

              getCategories();
              function getCategories() {
                categoryService.getCategories().success(
                    function(data) {
                      $scope.categories = data;
                    });
              }

            } ])
    .controller('ChatsCtrl', function($scope, Chats) {
      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page
      // change.
      // To listen for when this page is active (for example, to refresh
      // data),
      // listen for the $ionicView.enter event:
      //
      // $scope.$on('$ionicView.enter', function(e) {
      // });

      $scope.chats = Chats.all();
      $scope.remove = function(chat) {
        Chats.remove(chat);
      };
    })

    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
      $scope.chat = Chats.get($stateParams.chatId);
    })
    .controller('PointsCtrl', function($scope, $stateParams, Chats) {
      $scope.correct = $stateParams.param1;
      $scope.total = $stateParams.param2;
      $scope.points = $stateParams.param3;
    })
    .controller(
        'ProfileCtrl',
        function($scope,$window,$state, $cordovaOauth, ProfileService,
            UserService, $localstorage) {
          $scope.isAuthenticated = false;
          var user = {};
          var user = $localstorage.getObject('user');
          console.log('user' + JSON.stringify(user));
          console.log('user' + JSON.stringify(user));
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
                      console.log("result" + result);
                      console.log("result"
                          + JSON.stringify(result));
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
                      console.log("error" + error);
                    });
          }
          function saveUserData(user) {
            UserService.saveUserData(user).success(function(data) {
              $scope.userID = data.objectId;
              $localstorage.setObject('user', user);
          $state.go($state.current, {}, {reload: true});
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
                      console.log(result);
                      console.log(JSON.stringify(result));
                      $scope.access_token = result.access_token;
                      ProfileService
                          .getProfileFacebook(
                              $scope.access_token)
                          .success(
                              function(data) {
                                console
                                    .log(JSON
                                        .stringify(data));
                                user.name = data.name;
                                user.email = data.email;
                                user.imageURL = data.picture.data.url;
                                console
                                    .log('USER'
                                        + JSON
                                            .stringify(user));
                                saveUserData(user);
                              });

                    }, function(error) {
                      console.log(error);
                    });
          }
          $scope.logout = function() {

            $localstorage.setObject('user', undefined);
            $scope.isAuthenticated = false;
         $state.go($state.current, {}, {reload: true});
          }
        }).controller('AccountCtrl', function($scope) {
      $scope.settings = {
        enableFriends : true
      };
    });
