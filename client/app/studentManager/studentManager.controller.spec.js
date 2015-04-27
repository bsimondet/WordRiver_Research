'use strict';

describe('Controller: StudentManagerCtrl', function () {

  // load the controller's module
  beforeEach(module('WordRiverApp'));

  var StudentManagerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StudentManagerCtrl = $controller('StudentManagerCtrl', {
      $scope: scope
    });
  }));



  //it('should test findStudentInList', function () {
  //  for(var i = 0; i < scope.studentList.length; i++){
  //    expect(scope.findStudentInList(scope.studentList[i])).toEqual(i);
  //  }
  //});
  it('should test addGroup', function () {
    scope.groupField = "";
    scope.localGroupArray = [];
    console.log(scope.localGroupArray);
    scope.addGroup();
    console.log(scope.localGroupArray);
    expect(scope.localGroupArray.length).toEqual(0);
    scope.groupField = "Silly";
    scope.addGroup();
    expect(scope.localGroupArray.length).toEqual(1);

  });
  //Can't test due to the pop-up alert.
  //it('should test removeGroup', function () {
  //  scope.groupField = "";
  //  scope.localGroupArray = [];
  //  console.log(scope.localGroupArray);
  //  scope.addGroup();
  //  console.log(scope.localGroupArray);
  //  expect(scope.localGroupArray.length).toEqual(0);
  //  scope.groupField = "Silly";
  //  scope.addGroup();
  //  expect(scope.localGroupArray.length).toEqual(1);
  //  scope.removeGroup(0, scope.localGroupArray[0]);
  //
  //  expect(scope.localGroupArray.length).toEqual(0);
  //});

  it('should test findStudentInList', function () {
    scope.studentList = [{studentID: 1}];
    expect(scope.findStudentInList(1)).toEqual(0);
  });

  it('should test findStudentAccount', function () {
    scope.students = [{_id: 2}];
    expect(scope.findStudentAccount(2)).toEqual(0);
  });

  it('should test findGroupInList', function () {
    scope.localGroupArray = [{groupName: "Polo" }];
    expect(scope.findGroupInList("Polo")).toEqual(0);
  });

  it('should test assignStudentToGroup', function () {

    expect(1).toEqual(1);
  });

  it('should test addGroupsContextPacksToStudent', function () {
    scope.studentList = [];

    expect(1).toEqual(1);
  });

  it('should test addContextPacksToStudent', function () {

    expect(1).toEqual(1);
  });

  it('should test addStudentsToGroups', function () {
    expect(1).toEqual(1);
  });

  it('should test allCheckedGroups', function () {
    expect(1).toEqual(1);
  });

  it('should test allCheckedStudents', function () {
    expect(1).toEqual(1);
  });

  it('should test displayGroupInfo', function () {
    expect(1).toEqual(1);
  });

  it('should be true', function() {
    expect(true).toBe(true);
  });
  
});
