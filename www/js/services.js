angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [ {
    id : 0,
    name : 'Ben Sparrow',
    lastText : 'You on your way?',
    face : 'img/ben.png'
  }, {
    id : 1,
    name : 'Max Lynx',
    lastText : 'Hey, it\'s me',
    face : 'img/max.png'
  }, {
    id : 2,
    name : 'Adam Bradleyson',
    lastText : 'I should buy a boat',
    face : 'img/adam.jpg'
  }, {
    id : 3,
    name : 'Perry Governor',
    lastText : 'Look at my mukluks!',
    face : 'img/perry.png'
  }, {
    id : 4,
    name : 'Mike Harrington',
    lastText : 'This is wicked good ice cream.',
    face : 'img/mike.png'
  } ];

  return {
    all : function() {
      return chats;
    },
    remove : function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get : function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
}).factory('CategoryService', [ '$http', function($http) {
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

} ]).factory('ProfileService', [ '$http', function($http) {
  return {
    getProfile : getProfile
  };

  function getProfile(access_token) {
    console.log('access_token'+access_token);
    return $http({
      method : 'GET',
      url : 'https://www.googleapis.com/plus/v1/people/me?access_token='+access_token
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
      url : 'http://54.69.21.130/api/question/'+categoryType
      })
  }
  ;

} ]);
