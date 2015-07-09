'use strict';

describe('Controller: MyWordsCtrl', function () {

  // load the controller's module
  beforeEach(module('wordRiverApp'));

  var MyWordsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyWordsCtrl = $controller('MyWordsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
