'use strict';

describe('Controller: MyStudentsCtrl', function () {

  // load the controller's module
  beforeEach(module('wordRiverAppApp'));

  var MyStudentsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyStudentsCtrl = $controller('MyStudentsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
