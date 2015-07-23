//# sourceMappingURL=../../../maps/js/main.js.map
var app = angular.module('GuitarSchoolApp', ['ngRoute','firebase']);

app.constant('FIREBASE_URI','https://guitar-school.firebaseIO.com/');

app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
  $routeProvider
    .when('/',{
      templateUrl : './partials/home.html',
      controller  : 'MainController'
    })
    .when('/register', {
      templateUrl : './partials/register.html',
      controller  : 'UserAuthController'
    })
    .when('/login',{
      templateUrl : './partials/login.html',
      controller  : 'UserAuthController'
    })
    .when('/courses',{
      templateUrl : './partials/courses.html',
      controller  : 'CoursesController'
    })
    .when('/facebook',{
      templateUrl : './partials/home.html',
      controller  : 'AuthController'
    })
    .when('/github',{
      templateUrl : './partials/home.html',
      controller  : 'AuthController'
    });
}]);

app.factory('Auth', ['FIREBASE_URI','$firebaseAuth',
  function(FIREBASE_URI,$firebaseAuth) {
    var ref = new Firebase(FIREBASE_URI);
    return $firebaseAuth(ref);
  }
]);

app.controller('MainController', ['$scope','Auth',function($scope,Auth){
  $scope.authObj = Auth;
  $scope.courses = [
    'Beginner',
    'Intermediate',
    'Expert'
  ];
  $scope.authObj.$onAuth(function(authData){
    $scope.authData = authData;
  });
}]);

app.controller('CoursesController', ['$scope',function($scope){

}]);

//User Authentication Controller
app.controller('UserAuthController',['$scope','Auth',function($scope,Auth){
  $scope.authObj = Auth;

  $scope.registerUser = function(email,password){
    $scope.authObj.$createUser({
      email: $scope.email,
      password: $scope.password
    }).then(function(userData) {
      console.log("User " + userData.uid + " created successfully!");
      return $scope.authObj.$authWithPassword({
        email: $scope.email,
        password: $scope.password
      });
    }).then(function(authData) {
      console.log("Logged in as:", authData.uid);
      window.location.hash = '/#/';
    }).catch(function(error) {
      console.error("Error: ", error);
    });
  };

  $scope.loginUser = function(email,password){
    $scope.authObj.$authWithPassword({
      email: $scope.email,
      password: $scope.password
    }).then(function(authData) {
      console.log("Logged in as:", authData.password.email);
      window.location.hash="/#/";
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });
  };

  $scope.authObj.$onAuth(function(authData){
    $scope.authData = authData;
  });

  $scope.logoutUser = function(){

  };

}]);
