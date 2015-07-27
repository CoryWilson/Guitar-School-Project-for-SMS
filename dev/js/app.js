//# sourceMappingURL=../../../maps/js/main.js.map
var app = angular.module('GuitarSchoolApp', ['ngRoute','firebase']);


/***** Constants *****/

app.constant('FIREBASE_URI','https://guitar-school.firebaseIO.com/');


/***** Routes *****/

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
    .when('/:courseParam',{
      templateUrl : './partials/lessons.html',
      controller  : 'LessonsController'
    })
    .when('/:courseParam/:lessonParam',{
      templateUrl : './partials/lesson_page.html',
      controller  : 'LessonsController'
    });
}]);

/***** Factories *****/
app.factory('Auth', ['FIREBASE_URI','$firebaseAuth',
  function(FIREBASE_URI,$firebaseAuth) {
    var ref = new Firebase(FIREBASE_URI);
    return $firebaseAuth(ref);
  }
]);

app.factory('Courses', ['FIREBASE_URI','$firebaseAuth','$firebaseObject',
  function(FIREBASE_URI,$firebaseAuth,$firebaseObject){
    var ref = new Firebase(FIREBASE_URI);
    var coursesRef = ref.child('courses');
    return $firebaseObject(coursesRef);
  }
]);

app.factory('Lessons', ['FIREBASE_URI','$firebaseAuth','$firebaseObject',
  function(FIREBASE_URI,$firebaseAuth,$firebaseObject){
    var ref = new Firebase(FIREBASE_URI);
    var lessonsRef = ref.child('lessons');
    return $firebaseObject(lessonsRef);
  }
]);


/***** Controllers *****/

app.controller('MainController', ['$scope','$firebaseObject','Auth','Courses',function($scope,$firebaseObject,Auth,Courses){
  var obj = Courses;

  obj.$loaded().then(function() {
    console.log("loaded record:", obj.$id, obj.someOtherKeyInData);

    // To iterate the key/value pairs of the object, use angular.forEach()
    angular.forEach(obj, function(value, key) {
      console.log(key, value);
    });
  });

  $scope.data = obj;
}]);

app.controller('CoursesController', ['$scope','$firebaseObject','Auth','Courses',function($scope,$firebaseObject,Auth,Courses){
  var obj = Courses;

  obj.$loaded().then(function() {
    console.log("loaded record:", obj.$id, obj.someOtherKeyInData);

    // To iterate the key/value pairs of the object, use angular.forEach()
    angular.forEach(obj, function(value, key) {
      console.log(key, value);
    });
  });

  $scope.data = obj;

}]);

app.controller('LessonsController', ['$scope','$routeParams','$firebaseObject','Auth','Lessons',function($scope,$routeParams,$firebaseObject,Auth,Lessons){
  var course = $routeParams.courseParam;
  var lesson = $routeParams.lessonParam;
  console.log('Course Param: ', course);
  console.log('Lesson Param: ', lesson);

  var obj = Lessons;

  // to take an action after the data loads, use the $loaded() promise
  obj.$loaded().then(function() {
    console.log("loaded record:", obj.$id);

    // To iterate the key/value pairs of the object, use angular.forEach()
    angular.forEach(obj, function(value, key) {
      // console.log(key, value);
      if(key == course) {
        $scope.title = key;
        $scope.data = value;
        console.log('course: ',value);
        angular.forEach(value, function(v, k){
          if(k == lesson){
            $scope.data = v;
            console.log('lesson: ',v);
          }
        })
      }
    });
  });

}]);

//User Authentication Controller
app.controller('UserAuthController',['$scope','$firebaseObject','Auth',function($scope,$firebaseObject,Auth){
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
