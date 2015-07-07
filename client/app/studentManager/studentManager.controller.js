'use strict';

angular.module('WordRiverApp')
  .controller('StudentManagerCtrl', function ($scope, $location, $http, Auth) {
    //add group, delete group,
    $scope.studentList = []; //List of user references to students
    $scope.students = []; //List of actual student objects
    $scope.studentByID = []; //List of the current users students listed by id
    $scope.currentUser = Auth.getCurrentUser();
    $scope.classField = "";
    $scope.studentField = "";
    $scope.classArray = [];
    $scope.selectedClasses = [];
    $scope.selectedStudents = [];
    $scope.studentsInClass = []; //Student references
    $scope.selectedClassName = "";
    $scope.selectedClass = {};
    $scope.showClasses = true;
    $scope.studentClasses = [];
    $scope.selectedStudent = [];
    $scope.tiles = [];
    $scope.help = false;
    $scope.toGroupSort = "";
    $scope.groupOrder = false;
    $scope.needToAddID = false;
    $scope.IDtoAdd = "";
    $scope.firstname="";
    $scope.lastname="";
    $scope.needToRemoveID = false;
    $scope.IDtoRemove = "";
    $scope.needToRemoveStudID = false;
    $scope.StudIDtoRemove = "";

///////////////////////////////////
//    $scope.getStudentList = function(){
//      if(Auth.isLoggedIn()) {
//        $scope.studentList = $scope.currentUser.studentList;
//      }
//    };
//
//    $scope.getStudentList();
//////////////////////////////////

    $scope.getClasses = function(){
      $http.get("/api/users/me").success(function(user){
        $scope.classArray = user.classList;
      })
    };

    $scope.getClasses();

    $scope.getTiles = function(){
      $http.get("/api/tile").success(function(tiles){
        $scope.tiles = tiles;
      });
    };

    $scope.getTiles();

    $scope.toggleHelp = function(){
      $scope.help = !$scope.help;
    };

    $scope.getStudents = function(){
      $http.get("/api/students").success(function(allStudents) {
        $scope.manageStudents(allStudents);
      });
    };

    $scope.manageStudents = function(myStudents){
      $scope.students = [];
      $scope.studentList = [];
      $scope.studentByID = [];
      for(var i = 0; i < myStudents.length; i++){
        if($scope.inArray(myStudents[i].teachers, $scope.currentUser._id)){
          $scope.students.push(myStudents[i]);
          $scope.studentList.push(myStudents[i]);
          $scope.studentByID.push(myStudents[i]._id);
        }
      }
      if( $scope.needToAddID ){
        $scope.addStudentIDToUser($scope.IDtoAdd);
      }
      if ( $scope.needToRemoveID ){
        $scope.removeClassIDFromStudents($scope.IDtoRemove);
      }
      if ( $scope.needToRemoveStudID ){
        $scope.removeStudentIDFromUser($scope.StudIDtoRemove);
      }
    };

    $scope.getStudents();

    $scope.checkForDuplicates = function(array){
      for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
          if (array[i]==array[j]){
            array.splice(j,1);
          }
        }
      }
      return array;
    };

    $scope.addStudent = function () {
      if ($scope.firstname.length > 0 && $scope.lastname.length > 0) {
        $http.post('/api/students/',
          {firstName:$scope.firstname, lastName:$scope.lastname, teachers: $scope.currentUser._id}
        ).success(function(object){
            $scope.makeGlobalID(object._id);
          });
      }
      $scope.firstname="";
      $scope.lastname="";
    };

    $scope.makeGlobalID = function (id) {
      $scope.needToAddID = true;
      $scope.getStudents();
      $scope.IDtoAdd = id;
    };

    $scope.addStudentIDToUser = function (toAddID) {
      for(var index = 0; index < $scope.students.length; index++) {
        if ($scope.students[index]._id == toAddID) {
          $http.put('api/users/' + $scope.currentUser._id + '/addStudent',
              {studentID: toAddID}
          ).success(function () {
              //console.log("Successfully added ID to teacher!");
            });
        }
      }
      $scope.IDtoAdd = "";
    };

    $scope.addClass = function () {
      if ($scope.classField.length >= 1) {
        var newGroup = {groupName: $scope.classField, contextPacks: []};
        $scope.classArray.push(newGroup);
        $http.put('/api/users/' + $scope.currentUser._id + '/addClass',
          {className: $scope.classField}
        ).success(function(){
            $scope.getClasses();
          });
      }
      $scope.classField="";

    };

    $scope.classShow = function(){
      $scope.showClasses=true;
    };

    $scope.removeClass = function (index, myClass) {
      var choice = confirm("Are you sure you want to delete " + myClass.className + "?");
      if (choice == true) {
        $http.put('/api/users/' + $scope.currentUser._id + '/deleteClass',
          {myClass: myClass._id}
        ).success(function () {
            $scope.helperRemoveID(myClass._id);
          });
        $scope.classArray.splice($scope.findClassInList(myClass.className), 1);
      }
    };

    $scope.helperRemoveID = function (id) {
      $scope.needToRemoveID = true;
      $scope.getClasses();
      $scope.getStudents();
      $scope.IDtoRemove = id;
    };

    $scope.removeClassIDFromStudents = function (toRemoveID) {
      for(var index = 0; index < $scope.students.length; index++) {
        for(var index2 = 0; index2 < $scope.students[index].classList.length; index2++) {
          if ($scope.students[index].classList[index2]._id == toRemoveID) {
            console.log("Match!");
            $http.put('/api/students/' + $scope.students[index]._id + '/removeClass',
              {
                _id:$scope.students[index]._id,
                classID: toRemoveID
              }
            ).success(function () {
                console.log('Patched to users context ids');
              });
          }
        }
      }
      console.log("Do we even get here?");
    };

    $scope.removeStudent = function (index, student) {
      var choice = confirm("Are you sure you want to delete " + student.firstName + "?");
      if (choice == true) {
        $http.delete('/api/students/'+ student._id
        ).success(function () {
            $scope.getStudents();
            console.log("Removed student from db!");
            $http.put('/api/users/' + $scope.currentUser._id + '/removeStudentID',
              {studentID: student._id}
            ).success(function () {
                console.log("Removed studentID from user!");
              });
          });
        $scope.students.splice($scope.findClassInList(student.firstName), 1);
      }
    };

    //returns -1 if student is not in list. should never actually return -1.
    $scope.findStudentInList = function(student){
      var index = -1;
      for(var i = 0; i < $scope.studentList.length; i++){
        if($scope.studentList[i]._id == student){
          index = i;
        }
      }
      return index;
    };

    //returns -1 if student is not in list. should never actually return -1.
    $scope.findStudentAccount = function(studentID) {
      var index = -1;
      for(var i = 0; i < $scope.students.length; i++){
        if($scope.students[i]._id == studentID){
          index = i;
        }
      }
      return index;
    };

    $scope.findClassInList = function(className){
      var index = -1;
      for(var i = 0; i < $scope.classArray.length; i++){
        if($scope.classArray[i].className == className){
          index = i;
        }
      }
      return index;
    };

    //Takes in a student's ID and a groups name
    $scope.assignStudentToGroup = function(student, group){
      //console.log(student + " " + group);
      var studentIndex = $scope.findStudentInList(student);
      //console.log(studentIndex);

      if($scope.studentList[studentIndex].groupList.indexOf(group._id) == -1){
        $scope.studentList[studentIndex].groupList.push(group);
        if(group._id == $scope.selectedClass._id){
          $scope.studentsInClass.push($scope.studentList[studentIndex]);
        }
        $scope.addGroupsContextPacksToStudent(student);
        $http.put("/api/students/" + student + "/assignToGroup",
          {groupID: group._id}
        ).success(function () {
            $scope.getStudents();
          });
      }

    };

    $scope.addGroupsContextPacksToStudent = function(student){
      var fullStudent = $scope.studentList[$scope.findStudentInList(student)];
      for(var i = 0; i < $scope.selectedClasses.length; i++) {
        var groupIndex = $scope.findClassInList($scope.selectedClasses[i].groupName);
        $scope.addContextPacksToStudent($scope.classArray[groupIndex].contextPacks, fullStudent)
      }
    };

    $scope.addContextPacksToStudent = function(contextArray, student){
      for(var i = 0; i < contextArray.length; i++){

        //user side
        if(student.contextTags.indexOf(contextArray[i]) == -1) {
          student.contextTags.push(contextArray[i]);
        }

        //student side
        //console.log(student);
        var studentIndex = $scope.findStudentAccount(student._id);
        var notAdded = true;
        for(var j = 0; j < $scope.students[studentIndex].contextTags.length; j++){
          if(($scope.students[studentIndex].contextTags[j].creatorID == $scope.currentUser._id) && ($scope.students[studentIndex].contextTags[j].tagName == contextArray[i])){
            notAdded = false;
          }
        }
        if(notAdded){
          $scope.students[studentIndex].contextTags.push({tagName: contextArray[i], creatorID: $scope.currentUser._id});
          //$scope.addTilesToStudent($scope.students[studentIndex], contextArray[i]);
          $http.put("/api/students/"+student._id+"/addPack", {packId: contextArray[i]});
          $scope.addWordsToStudent(contextArray[i], student);
        }
      }
    };

    $scope.addWordsToStudent = function(pack, student){
      for(var i = 0; i < $scope.tiles.length; i++){
        if($scope.inArray($scope.tiles[i].contextTags, pack)){
          if(!$scope.inArray(student.tileBucket, pack)) {
            student.tileBucket.push(pack);
            $http.put("api/students/" + student._id + "/addWord", {word: $scope.tiles[i]._id});
          }
        }
      }
    };

    $scope.addStudentsToGroups = function(){
      //iterate over all of the students and all of the groups
      //call assignStudentToGroup on each pair
      for(var i = 0; i < $scope.selectedStudents.length; i++){
        for(var j = 0; j < $scope.selectedClasses.length; j++){
          $scope.assignStudentToGroup($scope.selectedStudents[i], $scope.selectedClasses[j]);
        }
      }
      $scope.selectedClasses = [];
      $scope.selectedStudents = [];
    };

    //Takes in a group name
    $scope.allCheckedGroups = function(category){
      //console.log(category);
      var counter;
      for (var i = 0; i < $scope.selectedClasses.length; i++) {
        if ($scope.selectedClasses[i] == category) {
          $scope.selectedClasses.splice(i, 1);
          counter = 1;
        }
      }
      if (counter != 1){
        $scope.selectedClasses.push(category);
      }
    };

    //Takes in a student ID
    $scope.allCheckedStudents = function(category){
      var counter;
      for (var i = 0; i < $scope.selectedStudents.length; i++) {
        if ($scope.selectedStudents[i] == category) {
          $scope.selectedStudents.splice(i, 1);
          counter = 1;
        }
      }
      if (counter != 1){
        $scope.selectedStudents.push(category);
      }
    };

    $scope.displayStudentClasses = function(student){
      $scope.showClasses = false;
      $scope.selectedStudent = student;
      $scope.studentClasses = [];
      for (var i = 0; i < $scope.classArray.length; i++){
        for(var x = 0; x < $scope.studentList[i].classList.length; x++) {
          if ($scope.selectedStudent.classList[x]._id == $scope.classArray[i]._id) {
            $scope.studentClasses.push($scope.classArray[i]);
          }
        }
      }
    };

    $scope.displayClassInfo = function(myclass){
      $scope.selectedClassName = myclass.className;
      $scope.studentsInClass = [];
      $scope.selectedClass = myclass;
      for(var i = 0; i < $scope.studentList.length; i++){
        for(var x = 0; x < $scope.studentList[i].classList.length; x++) {
          if ($scope.studentList[i].classList[x]._id == myclass._id) {
            $scope.studentsInClass.push($scope.studentList[i]);
          }
        }
      }
    };


    $scope.inArray= function(array, item){
      for(var i = 0; i < array.length; i++){
        if(array[i] == item){
          return true;
        }
      }
      return false;
    };

    $scope.orderBy = function (property) {
      var sortOrder = 1;
      if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function (a,b) {
        //var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        var result = 0;
        if (a[property] < b[property]) {
          result = -1;
        } else if (a[property] > b[property]) {
          result=1;
        } else {
          result = 0;
        }
        //console.log("Things Should show up");
        return result * sortOrder;
      }
    };
    //////////////////////////////////////////////////////////////////////////

    $scope.removeGroupFromStudent = function (group){
      var index = $scope.findClassInList(group.groupName);
      //console.log(index);
      $scope.selectedClass = $scope.classArray[index];

      $scope.removeStudentFromGroup($scope.selectedStudent);
      //console.log("Yo");
      for (var i = 0; i < $scope.studentClasses.length; i++){
        if ($scope.studentClasses[i] == group._id){
          $scope.studentClasses.splice(i, 1);
        }
      }
      $scope.displayStudentClasses($scope.selectedStudent);
    };


    //making remove for students from groups.
    $scope.removeStudentFromGroup = function (student) {
      for (var i = 0; i < $scope.studentList.length; i++) {
        if (student == $scope.studentList[i]) {
          for (var j = 0; j < $scope.studentList[i].groupList.length; j++) {
            //console.log($scope.selectedClassName + " "+ $scope.studentList[i].groupList[j] )
            if ($scope.studentList[i].groupList[j] == $scope.selectedClass._id) {
              $scope.studentList[i].groupList.splice(j, 1);

              //Start here once the seed is changed
              $http.put('api/students/' + $scope.studentList[i]._id + '/deleteFromGroup',
                {groupID: $scope.selectedClass._id}
              ).success(function () {
                  $scope.syncUser();
                });
              break;
            }
          }
          break;
        }
      }
      for (var h = 0; h < $scope.studentsInClass.length; h++) {
        if (student == $scope.studentsInClass[h]) {
          $scope.studentsInClass.splice(h, 1);
        }
      }
      $scope.displayClassInfo($scope.selectedClass);
    };

    //////////////////////////////////////////////////////////
    //Trying to write and edit group name function. Having troubles with changing just the name.
    $scope.editClassName = function (myclass) { // This is a good function
      var index = $scope.findClassInList(myclass.className);
      var text = prompt("Provide a new name for " + $scope.classArray[index].className + ".", "");
      if (text != null) {
        var choice = confirm("Are you sure you want to change the name of " + $scope.classArray[index].className + " to " + text + "?");
        if (choice == true) {
          $scope.classArray[index].className = text;
          $http.put('/api/users/' + $scope.currentUser._id + '/class',
            {index: index, className: text}
          ).success(function () {
              $scope.getStudents();
            });

        }
      }
    };
    $scope.getClasses();
  });

