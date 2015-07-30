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
    .when('/messages',{
      templateUrl : './partials/messages.html',
      controller  : 'MessagesController'
    })
    .when('/profile',{
      templateUrl : './partials/profile.html',
      controller  : 'ProfileController'
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

app.factory('Profile', ['FIREBASE_URI','$firebaseObject',
  function(FIREBASE_URI,$firebaseObject) {
    return function(username){
      var ref = new Firebase(FIREBASE_URI+'users/'+username);
      return $firebaseObject(ref);
    };
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

app.controller('MainController', ['$scope','$firebaseObject','Auth','Courses','FIREBASE_URI',function($scope,$firebaseObject,Auth,Courses,FIREBASE_URI){
  var obj = Courses;

  obj.$loaded().then(function() {
    console.log("loaded record:", obj.$id);
    // To iterate the key/value pairs of the object, use angular.forEach()
    angular.forEach(obj, function(value, key) {
      //console.log(key, value);
    });
  });
  $scope.data = obj;

  $scope.authObj = Auth;
  $scope.authObj.$onAuth(function(authData){
    $scope.authData = authData;
  });

}]);

app.controller('CoursesController', ['$scope','$firebaseObject','Auth','Courses',function($scope,$firebaseObject,Auth,Courses){
  var obj = Courses;

  obj.$loaded().then(function() {
    console.log("loaded record:", obj.$id, obj.someOtherKeyInData);

    // To iterate the key/value pairs of the object, use angular.forEach()
    angular.forEach(obj, function(value, key) {
      //console.log(key, value);
    });
  });

  $scope.data = obj;

}]);

app.controller('LessonsController', ['FIREBASE_URI','$scope','$routeParams','$firebaseObject','Profile','Auth',function(FIREBASE_URI,$scope,$routeParams,$firebaseObject,Profile,Auth){
  $scope.authObj = Auth;

  //saves route parameters as a variable
  var course = $routeParams.courseParam;
  var lesson = $routeParams.lessonParam;

  //creates a firebase reference to the url with params
  var courseRef = new Firebase(FIREBASE_URI+'lessons/'+course);
  //creates a new firebase object based off that ref
  var courseObj = $firebaseObject(courseRef);

  //creates a firebase reference to the url with params
  var lessonRef = new Firebase(FIREBASE_URI+'lessons/'+course+'/'+lesson);
  //creates a new firebase object based off that ref
  var lessonObj = $firebaseObject(lessonRef);

  //makes the objects visible to angular
  $scope.courseData = courseObj;
  $scope.lessonData = lessonObj;

  $scope.authObj.$onAuth(function(authData){
    if(authData){
      Profile(authData.uid).$bindTo($scope,'profile');
    }
  });

}]);

app.controller('ProfileController',['Profile','Auth','$scope','$firebaseObject',function(Profile,Auth,$scope,$firebaseObject){
  //returns user profile information
  $scope.authObj = Auth;

  //checks user authentication
  $scope.authObj.$onAuth(function(authData){
    if(authData){
      //pulls the profile obj based on authData.uid
      //$scope.profile = Profile(authData.uid);
      Profile(authData.uid).$bindTo($scope,'profile').then(function(){
        $scope.auth = authData;
        console.log($scope.profile.name);
        //change email
        $scope.changeEmail = function(){
          $scope.authObj.$changeEmail({
            oldEmail: $scope.profile.email,
            newEmail: $scope.newEmail,
            password: $scope.profile.password
          }).then(function() {
            console.log("Email changed successfully!");
            $scope.profile.email = $scope.newEmail;
          }).catch(function(error) {
            console.error("Error: ", error);
          });
        };
        //change password
        $scope.changePassword = function(){
          $scope.authObj.$changePassword({
            email: $scope.profile.email,
            oldPassword: $scope.profile.password,
            newPassword: $scope.profile.newPassword
          }).then(function(){
            console.log("Password changed successfully!");
            $scope.profile.password = $scope.profile.newPassword;
          }).catch(function(error){
            console.error("Error: ",error);
          });
        };
        //reset password
        $scope.resetPassword = function(){
          $scope.authObj.$resetPassword({
            email: $scope.profile.email
          }).then(function(){
            console.log("Password reset email sent successfully!");
          }).catch(function(error){
            console.error("Error: ",error);
          });
        };
      });
    } else {
      //if the user is not authenticated relocate to home
      window.location.hash="/#/";
    }
  });
}]);


app.controller('MessagesController',['FIREBASE_URI','Auth','Profile','$scope','$firebaseArray', function(FIREBASE_URI,Auth,Profile,$scope,$firebaseArray){

  $scope.authObj = Auth;

  var ref = new Firebase(FIREBASE_URI+'messages');
  var messagesArray = $firebaseArray(ref);

  $scope.authObj.$onAuth(function(authData){
    if(authData){
      $scope.profile = Profile(authData.uid);
      $scope.post = '';
      $scope.messages = messagesArray;

      $scope.sendMessage = function(){
        if($scope.post.length > 0){
          messagesArray.$add({
            post:$scope.post,
            name:$scope.profile.name
          }).then(function(ref){
            var id = ref.key();
            console.log('added records with id ',id);
            messagesArray.$indexFor(id);
            $scope.post = '';
            console.log(messagesArray);
            var item = messagesArray[0];
            if(messagesArray == 10){
              messagesArray.$remove(item).then(function(id){
                id === item.$id; // true
              });
            }
          });
        }
      };
    }
  });


}]);


//User Authentication Controller
app.controller('UserAuthController',['FIREBASE_URI','$scope','$firebaseObject','Auth',function(FIREBASE_URI,$scope,$firebaseObject,Auth){
  var ref = new Firebase(FIREBASE_URI);
  var profileRef = ref.child('users');
  $scope.authObj = Auth;
  var isNewUser = false;

  $scope.registerUser = function(email,password){
    $scope.authObj.$createUser({
      email: $scope.email,
      password: $scope.password
    }).then(function(userData) {
      console.log("User " + userData.uid + " created successfully!");
      isNewUser = true;
      return $scope.authObj.$authWithPassword({
        email: $scope.email,
        password: $scope.password
      });
    }).then(function(authData) {
      console.log("Logged in as:", authData);
      if(authData && isNewUser){
        profileRef.child(authData.uid).set({
          provider: authData.provider,
          name: getName(authData)
        });
      }
      function getName(authData){
        switch(authData.provider){
          case 'password':
            return authData.password.email.replace(/@.*/, '');
        }
      }
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
