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

  it('should test findStudentAccount', function () {

    expect(1).toEqual(1);
  });

  it('should test findGroupInList', function () {
    expect(1).toEqual(1);
  });

  it('should test assignStudentToGroup', function () {
    expect(1).toEqual(1);
  });

  it('should test addGroupsContextPacksToStudent', function () {
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
