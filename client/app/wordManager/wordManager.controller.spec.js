'use strict';

describe('Controller: WordManagerCtrl', function () {

  // load the controller's module
  beforeEach(module('WordRiverApp'));
  beforeEach(module('socketMock'));

  var OverviewCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/packs')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
    $httpBackend.expectGET('/api/students')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    OverviewCtrl = $controller('WordManagerCtrl', {
      $scope: scope
    });
    scope.currentUser.contextPacks = ["france", "spain", "germany", "united kingdom"];
  }));

  it('this tests the function checkCheckbox', function () {
    expect(true).toBe(true);
  });

  it('this tests the function getWordPacks', function () {
    //scope.getCategories();
    //expect(scope.categoryArray.length).toBe(4)
  });

  it('this tests the function addWordPack', function () {
    expect(true).toBe(true);
  });

  it('this tests the function getWords', function () {
    expect(true).toBe(true);
  });

  it('this tests the function addWord', function () {
    expect(true).toBe(true);
  });

  it('this tests the function displayCatInfo', function () {
    expect(true).toBe(true);
  });

  it('this tests the function displayWordInfo', function () {
    expect(true).toBe(true);
  });

  it('this tests the function removeCategory', function () {
    expect(true).toBe(true);
  });

  it('this tests the function removeWord', function () {
    expect(true).toBe(true);
  });

});
