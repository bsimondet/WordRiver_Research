'use strict';

angular.module('WordRiverApp')
  .controller('WordManagerCtrl', function ($scope, $http, socket, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.categoryField = "";
    $scope.addField = "";
    $scope.addType = "";
    $scope.editField = "";
    $scope.editType = "";
    $scope.searchField = "";
    $scope.categoryArray = [];
    $scope.currentUser = Auth.getCurrentUser();
    $scope.selectedCategories = [];
    $scope.selectedTiles = [];
    $scope.allTiles = [];
    $scope.allCatTiles = [];
    $scope.userTiles = [];
    $scope.matchTiles = [];
    $scope.toSort = "tile";
    $scope.order = true;
    $scope.currentCategory = null;
    $scope.currentTile = null;
    $scope.tileId = "";
    $scope.contextTagsTemp = [];
    $scope.showValue = true;
    $scope.showValue1 = true;
    $scope.wordToEdit = null;

    $scope.theIDWeWant = null;
   // $scope.wordToRemove = null;
    //$scope.selectedCategories = [];

    $scope.confirmDelete = function(category) {
      this.index = $scope.findIndexOfCat(category);
      if (confirm("Are you sure you want to delete " + $scope.categoryArray[$scope.findIndexOfCat(category)].name + "?") == true) {
        $scope.removeCategory(category);
      }
    };


    $scope.getCategories = function() {
      $scope.categoryArray.splice(0, $scope.categoryArray.length);
      $http.get('/api/categories').success(function (allCategories) {
        console.log(allCategories);
        for (var i = 0; i < $scope.currentUser.contextPacks.length; i++) {
          for(var j = 0; j < allCategories.length; j++){
            if(allCategories[j]._id == $scope.currentUser.contextPacks[i]){
              $scope.categoryArray.push(allCategories[i]);
              console.log($scope.categoryArray.length);
            }
          }
        }
      });
    };


    $scope.addTileToCategory = function() {
      //console.log($scope.selectedCategories.length);
      var index =-1;
      for(var i = 0; i < $scope.selectedCategories.length; i++){
        //console.log("Test2");
        for(var j = 0; j < $scope.selectedTiles.length; j++){
          index =  $scope.findTileByIndex($scope.selectedTiles[j]);
          //$scope.selectedTiles[j].contextTags.push($scope.selectedCategories[i]);
          if(!$scope.inArray($scope.userTiles[index].contextTags, $scope.selectedCategories[i])) {
            $http.put('/api/tile/' + $scope.userTiles[index]._id + "/updateTile", {
              tile: $scope.userTiles[index],
              tileId: $scope.userTiles[index]._id,
              newCategory: $scope.selectedCategories[i]
            }).success(function () {
              //$scope.getCategories();
              //$scope.getWords();
            });
            $scope.userTiles[index].contextTags.push($scope.selectedCategories[i]);
          }
          //$scope.selectedTiles[j].test = [];
          //$scope.selectedTiles[j].test.push($scope.selectedCategories[i]);
          //console.log("Test4");
        }
      }
      //for(var j = 0; j < $scope.selectedTiles; j++){
      //  $http.put('/api/tile/' + $scope.selectedTiles[j]._id + "/updateTile", {tile: $scope.selectedTiles[j], tileId: $scope.selectedTiles[j]._id})
      //}
      if($scope.currentTile != null) {
        $scope.displayWordInfo($scope.currentTile);
      }
      if($scope.currentCategory != null) {
        $scope.displayCatInfo($scope.currentCategory);
      }
    };

    $scope.findTileByIndex = function(tile){
      for(var i = 0; i < $scope.userTiles.length; i++){
        if($scope.userTiles[i]._id == tile){
          return i;
        }
      }
      return -1;
    };

    $scope.inArray = function(array, item){
      for(var i = 0; i < array.length; i++){
        console.log("Thing"+array[i]);
        if(array[i] == item){
          return true;
        }
      }
      return false;
    };


    $scope.getCategories();

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('pack');
    });

    $scope.addCategory = function () {
      if ($scope.categoryField.length >= 1) {
        console.log($scope.categoryField);
        $http.post('/api/categories/',
          {name:$scope.categoryField, isWordType: false, creatorID: $scope.currentUser._id}
        ).success(function(){console.log($scope.currentUser._id)});

        $scope.theIDWeWant = null;
        $http.get('/api/categories').success(function(allCats){
          $scope.theIDWeWant = allCats[allCats.length - 1]._id
          console.log("success??");
          $scope.currentUser.contextPacks.push($scope.theIDWeWant);
        });
      }

      $scope.categoryField="";
      $scope.getCategories();
    };

    $scope.getWords = function(){
      $scope.userTiles.splice(0,$scope.userTiles.length);
      $http.get('/api/tile').success(function(allTiles) {
        $scope.allTiles = allTiles;
        for(var i= 0; i < $scope.allTiles.length; i++){
          if($scope.currentUser._id == $scope.allTiles[i].creatorID){
            $scope.userTiles.push($scope.allTiles[i]);
          }
        }
      });
    };

    $scope.getWords();

    $scope.addWord = function() {
      if ($scope.addField.length >= 1 && $scope.addType.length >= 1) {
        $http.post('/api/tile', {
          name: $scope.addField,
          contextTags: $scope.selectedCategories,
          creatorID: $scope.currentUser._id,
          wordType: $scope.addType
        });
        $scope.addField = "";
        $scope.getWords();
      }
    };

    //$scope.getAllTiles = function(){
    //  $http.get('/api/tile').success(function (allTiles) {
    //    $scope.allCatTiles = allTiles;
    //    for (var i = 0; i < $scope.allCatTiles.length; i++) {
    //      if ($scope.currentUser._id == $scope.allCatTiles[i].creatorID) {
    //        $scope.userTiles.push($scope.allCatTiles[i]);
    //      }
    //    }
    //  });
    //};
    //
    //$scope.getAllTiles();
    //cat is short for category
    $scope.displayCatInfo = function (category) {
      //$scope.userTiles = [];
      $scope.matchTiles = [];
      $scope.currentCategory = category;
      //$http.get('/api/tile').success(function (allTiles) {
        //  $scope.allCatTiles = allTiles;
        //  for (var i = 0; i < $scope.allCatTiles.length; i++) {
        //    if ($scope.currentUser._id == $scope.allCatTiles[i].creatorID) {
        //      $scope.userTiles.push($scope.allCatTiles[i]);
        //    }
        //  }
        for (var j = 0; j < $scope.userTiles.length; j++) {
          for (var z = 0; z < $scope.userTiles[j].contextTags.length; z++) {
            if ($scope.userTiles[j].contextTags[z] == category._id) {
              $scope.matchTiles.push($scope.userTiles[j]);
              //console.log($scope.userTiles[j].name);
            }
          }
        }
        if ($scope.matchTiles.length > 0) {

        } else {
          alert("There are no tiles in this category");
        }

    };


    $scope.getCategoryFromTagName = function(tile, index) {
      for(var i = 0; i < $scope.categoryArray.length; i++){
        console.log(tile.contextTags[index] + " "+ $scope.categoryArray[i]._id);
        if(tile.contextTags[index] == $scope.categoryArray[i]._id){
          $scope.contextTagsTemp.push($scope.categoryArray[i]);
          console.log($scope.categoryArray[i]);
        }
      }
    };

      $scope.displayWordInfo = function (word) {
        $scope.contextTagsTemp = [];
        $scope.currentTile = word;
        //for(var i =0; i < $scope.allTiles.length; i++){
        //console.log(word.name)
        //  if($scope.allTiles[i]._id == word._id){
        //    if($scope.allTiles[i].contextTags.length > 0) {
        //      for (var j = 0; j < $scope.allTiles[i].contextTags.length; j++){
        //       $scope.getCategoryFromTagName($scope.allTiles[i]);
        //      }
        //      //alert("This tile has the categories:\n" + $scope.contextTagsTemp.join('\n'));
        //    }
        //    else{
        //      //alert("This tile has no categories.");
        //    }
        //  }
        //}


        for (var j = 0; j < word.contextTags.length; j++) {
          $scope.getCategoryFromTagName(word, j);
        }


      };

    //$scope.addWordToCategory = function() {
    //
    //};

    //$scope.updateTileV2 = function(tile) {
    //
    //  $http.put('/api/tile' + $scope.tileId + "/updateTile", {})
    //}
    //Deletes a category
    $scope.removeCategory = function(category) {
      $scope.catToRemove = $scope.categoryArray[$scope.findIndexOfCat(category)];
      console.log(category.name);
      $http.delete('/api/categories/'+ $scope.catToRemove._id);
      $scope.categoryArray.splice($scope.findIndexOfCat(category), 1);
      for(var i = 0; i<$scope.currentUser.contextPacks.length; i++){
        if($scope.currentUser.contextPacks[i] == $scope.catToRemove._id){
          $scope.currentUser.contextPacks.splice(i,1);
        }
      }
      $scope.getCategories();
      //var categoryArrayIDS = [];
      //for(var i = 0; i < $scope.categoryArray.length; i ++){
      //  categoryArrayIDS.push($scope.categoryArray[i]._id);
      //}
      //$http.patch('/api/users/' + $scope.currentUser._id, {
      //  contextPacks : categoryArrayIDS
      //});
    };

      //Removes a word from a category
    $scope.removeFromCategory = function(tile, index) {
      //console.log("test");
      $scope.tileId = tile._id;
      $http.put('/api/tile/' + $scope.tileId + "/removeFromCategory", {category: $scope.currentCategory._id, tileId: tile._id});
      //console.log("test");
      //console.log(tile._id);
      $scope.matchTiles.splice(index, 1);
      //$http.post('/api/packs', {packName: pack.packName, tiles: pack.tiles});
      //$http.delete('/api/packs/' + pack._id);
    };

    //Removes a category from a word, on the server side this does the same thing as removeFromCategory
    $scope.removeCategoryFromWord = function(index) {
      $scope.tileId = $scope.currentTile._id;
      $http.put('/api/tile/' + $scope.tileId + "/removeFromCategory", {category: $scope.contextTagsTemp[index]._id, tileId: $scope.currentTile._id});
      //console.log("test");
      //console.log(tile._id);
      $scope.contextTagsTemp.splice(index, 1);
    };

    //deletes a word
    $scope.removeWord = function(tile) {
      $scope.wordToRemove = $scope.userTiles[$scope.findIndexOfTile(tile)];
      $http.delete('/api/tile/'+ $scope.wordToRemove._id);
      $scope.getWords();
      //var wordToRemove = $scope.userTiles[index];
      $scope.userTiles.splice($scope.findIndexOfTile(tile),1);
      for(var i = 0; i < $scope.allTiles.length; i++){
        if($scope.wordToRemove.id == $scope.allTiles[i].id) {
            $scope.allTiles.splice(i,1);
          }
      }
    };

    $scope.findIndexOfTile = function(tile){
      for(var i = 0; i < $scope.userTiles.length; i++){
        if(tile._id == $scope.userTiles[i]._id){
          return i;
        }
      }
    }
    //
    $scope.editWord = function(tile){
      $scope.editWordIndex = $scope.findIndexOfTile(tile);
      $scope.showValue = false;
      $scope.wordToEdit = $scope.userTiles[$scope.findIndexOfTile(tile)];
    };

    $scope.updateTile = function() {
      if($scope.editField.length >= 1 && $scope.editType.length < 1){
        //Only editing the word text
        $http.post('/api/tile', {
          name: $scope.editField,
          contextTags: $scope.userTiles[$scope.editWordIndex].contextTags,
          creatorID: $scope.userTiles[$scope.editWordIndex].creatorID,
          wordType: $scope.userTiles[$scope.editWordIndex].wordType
        });
        $scope.removeWord($scope.wordToEdit);

        $scope.editField = "";
      }
      else if($scope.editField.length == 0 && $scope.editType.length >= 1){
        //Only editing the word type
        $http.post('/api/tile', {
          name: $scope.userTiles[$scope.editWordIndex].name,
          contextTags: $scope.userTiles[$scope.editWordIndex].contextTags,
          creatorID: $scope.userTiles[$scope.editWordIndex].creatorID,
          wordType: $scope.editType
        });
        $scope.removeWord($scope.wordToEdit);

        $scope.editType = "";
      }
      else if($scope.editField.length >= 1 && $scope.editType.length >= 1){
        //Editing both the word type and the word text
        $http.post('/api/tile', {
          name: $scope.editField,
          contextTags: $scope.userTiles[$scope.editWordIndex].contextTags,
          creatorID: $scope.userTiles[$scope.editWordIndex].creatorID,
          wordType: $scope.editType
        });
        $scope.removeWord($scope.wordToEdit);

        $scope.editField = "";
        $scope.editType = "";
      }

      $scope.showValue = true;
    }

    $scope.findIndexOfCat = function(category){
      for(var i = 0; i < $scope.categoryArray.length; i++){
        if(category._id == $scope.categoryArray[i]._id){
          return i;
        }
      }
    }

    $scope.editCategory = function(category){
      $scope.editCatIndex = $scope.findIndexOfCat(category);
      $scope.showValue1 = false;
      $scope.categoryToEdit = $scope.userTiles[$scope.findIndexOfTile(category)];
    };

    $scope.updateCategory = function(){
      if($scope.editField.length >= 1){

      }
      $scope.showValue1 = true;
    }

    //$scope.setWordType = function(category){
    //  if($scope.cateogoryArray[$scope.findIndexOfCat(category)].isWordType == false || $scope.cateogoryArray[$scope.findIndexOfCat(category)].isWordType == null){
    //    $scope.cateogoryArray[$scope.findIndexOfCat(category)].isWordType = true;
    //  }
    //  else{
    //    $scope.cateogoryArray[$scope.findIndexOfCat(category)].isWordType = false;
    //  }
    //  console.log($scope.categoryArray[$scope.findIndexOfCat(category)].isWordType);
    //}

  });
