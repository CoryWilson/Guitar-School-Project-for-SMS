//# sourceMappingURL=../../../maps/js/main.js.map
var app = angular.module('GuitarSchoolApp', ['ngRoute','firebase']);

app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
  $routeProvider
    .when('/',{
      templateUrl : './partials/home.html',
      controller  : 'MainController'
    })
    .when('/register', {
      templateUrl : './partials/register.html',
      controller  : 'AuthController'
    })
    .when('/login',{
      templateUrl : './partials/login.html',
      controller  : 'AuthController'
    })
    .when('/courses',{
      templateUrl : './partials/courses.html',
      controller  : 'CoursesController'
    });
    // $locationProvider.html5Mode(true);
}]);

app.controller('MainController', function(){

});

app.controller('CoursesController', function(){

});
// var myDataRef = new Firebase('https://guitar-school.firebaseIO.com/');

//User Authentication Controller
app.controller('AuthController',['$scope','$firebaseAuth'],function($scope,$firebaseAuth){
  var ref = new Firebase('https://guitar-school.firebaseIO.com/');
  var auth = $firebaseAuth(ref);

  $scope.login = function(){
    $scope.authData = null;
    $scope.error = null;

  };

  $scope.authObj.$authWithPassword({
    email: "my@email.com",
    password: "mypassword"
  }).then(function(authData) {
    console.log("Logged in as:", authData.uid);
  }).catch(function(error) {
    console.error("Authentication failed:", error);
  });
});

//Message Test Example Controller
app.controller('MessageTestController', function($scope,$firebaseArray){
  var ref = new Firebase('https://guitar-school.firebaseIO.com/');

  //3-Way Data Binding Example
  // var syncObject = $firebaseObject(ref);
  // syncObject.$bindTo($scope, 'data');

  $scope.messages = $firebaseArray(ref);

  $scope.addMessage = function(){
    $scope.messages.$add({
      text: $scope.newMessageText
    });
  };
});
