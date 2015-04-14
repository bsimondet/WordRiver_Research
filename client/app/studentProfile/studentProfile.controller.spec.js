'use strict';

describe('Controller: StudentProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('WordRiverApp'));
  beforeEach(module('socketMock'));

  var StudentProfileCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StudentProfileCtrl = $controller('StudentProfileCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
