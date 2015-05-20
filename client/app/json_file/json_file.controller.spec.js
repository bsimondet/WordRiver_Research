'use strict';

describe('Controller: JsonFileCtrl', function () {

  // load the controller's module
  beforeEach(module('wordRiverAppApp'));

  var JsonFileCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JsonFileCtrl = $controller('JsonFileCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
