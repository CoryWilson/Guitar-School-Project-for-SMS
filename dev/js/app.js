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
      controller  : 'RegisterUserController'
    })
    .when('/login',{
      templateUrl : './partials/login.html',
      controller  : 'LoginUserController'
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

app.controller('MainController', ['$scope',function($scope){
  $scope.courses = [
    'Beginner',
    'Intermediate',
    'Expert'
  ];
}]);

app.controller('CoursesController', ['$scope',function($scope){

}]);

//User Authentication Controller
app.controller('RegisterUserController',['FIREBASE_URI','$scope','$firebaseAuth',function(FIREBASE_URI,$scope,$firebaseAuth){
  var ref = new Firebase(FIREBASE_URI);
  $scope.authObj = $firebaseAuth(ref);

  $scope.registerUser = function(email,password){
    console.log($scope.email);
    console.log($scope.password);
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
    }).catch(function(error) {
      console.error("Error: ", error);
    });
  };

}]);

app.controller('LoginUserController', ['FIREBASE_URI','$scope','$firebaseAuth', function(FIREBASE_URI,$scope,$firebaseAuth){
  var ref = new Firebase('https://guitar-school.firebaseIO.com/');
  $scope.authObj = $firebaseAuth(ref);

  $scope.loginUser = function(email,password){
    console.log($scope.email);
    console.log($scope.password);
    $scope.authObj.$authWithPassword({
      email: $scope.email,
      password: $scope.password
    }).then(function(authData) {
      console.log("Logged in as:", authData.uid);
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });
  };

}]);
