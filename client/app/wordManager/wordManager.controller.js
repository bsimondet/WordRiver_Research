'use strict';

angular.module('WordRiverApp')
  .controller('WordManagerCtrl', function ($scope, $http, socket, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.categoryField = "";
    $scope.addField = "";
    $scope.addType = "";
    $scope.searchField = "";
    $scope.categoryArray = [];
    $scope.currentUser = Auth.getCurrentUser();
    $scope.selectedCategories = [];
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
    $scope.wordToEdit = null;
   // $scope.wordToRemove = null;
    //$scope.selectedCategories = [];

    $scope.confirmDelete = function(index) {
      this.index = index;
      if (confirm("Are you sure you want to delete " + $scope.categoryArray[index] + "?") == true) {
        $scope.removeCategory(index);
      }
    };


    $scope.getCategories = function() {
      $http.get('/api/categories').success(function (allCategories) {
        console.log(allCategories);
        for (var i = 0; i < $scope.currentUser.contextPacks.length; i++) {
          for(var j = 0; j < allCategories.length; j++){
            if(allCategories[j]._id == $scope.currentUser.contextPacks[i]){
              $scope.categoryArray.push(allCategories[i]);
            }
          }
        }
      });
    }


    $scope.checkCheckbox = function(category){
      var counter;
        for (var i = 0; i < $scope.selectedCategories.length; i++) {
          if ($scope.selectedCategories[i].tagName == category) {
            $scope.selectedCategories.splice(i, 1);
            counter = 1;
          }
        }
      if (counter != 1){
        $scope.selectedCategories.push({
          tagName:category
        });
      }
    };

    $scope.getCategories();

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('pack');
    });

    $scope.addCategory = function () {
      if ($scope.categoryField.length >= 1) {
        $scope.categoryArray.push($scope.categoryField);
        $http.patch('/api/users/' + $scope.currentUser._id + '/category',
          {contextPacks: $scope.categoryArray}
        ).success(function(){
          });
      }
      $scope.categoryField="";
      $scope.getCategories();
    };

    $scope.getWords = function(){
      $scope.userTiles = [];
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
        console.log($scope.selectedCategories.length);
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

    $scope.getAllTiles = function(){
      $http.get('/api/tile').success(function (allTiles) {
        $scope.allCatTiles = allTiles;
        for (var i = 0; i < $scope.allCatTiles.length; i++) {
          if ($scope.currentUser._id == $scope.allCatTiles[i].creatorID) {
            $scope.userTiles.push($scope.allCatTiles[i]);
          }
        }
      });
    };

    $scope.getAllTiles();
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
            console.log($scope.userTiles[j].contextTags[z].tagName)
            if ($scope.userTiles[j].contextTags[z].tagName == category._id) {
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


      $scope.displayWordInfo = function (word) {
        $scope.contextTagsTemp = [];
        $scope.currentTile = word;
        for(var i =0; i<$scope.allTiles.length; i++){
          if($scope.allTiles[i].name == word.name){
            if($scope.allTiles[i].contextTags.length > 0) {
              for (var j = 0; j < $scope.allTiles[i].contextTags.length; j++){
                $scope.contextTagsTemp.push($scope.allTiles[i].contextTags[j].tagName);
              }
              //alert("This tile has the categories:\n" + $scope.contextTagsTemp.join('\n'));
            }
            else{
              //alert("This tile has no categories.");
            }
          }
        }
      };

    //Deletes a category
    $scope.removeCategory = function(index) {
      $scope.categoryArray.splice(index, 1);
      $http.patch('/api/users/'+$scope.currentUser._id+'/category',{
        contextPacks : $scope.categoryArray
      });
    };

      //Removes a word from a category
    $scope.removeFromCategory = function(tile, index) {
      //console.log("test");
      $scope.tileId = tile._id;
      $http.put('/api/tile/' + $scope.tileId + "/removeFromCategory", {category: $scope.currentCategory, tileId: tile._id});
      //console.log("test");
      console.log(tile._id);
      $scope.matchTiles.splice(index, 1);
      //$http.post('/api/packs', {packName: pack.packName, tiles: pack.tiles});
      //$http.delete('/api/packs/' + pack._id);
    };

    //Removes a category from a word, on the server side this does the same thing as removeFromCategory
    $scope.removeCategoryFromWord = function(index) {
      $scope.tileId = $scope.currentTile._id;
      $http.put('/api/tile/' + $scope.tileId + "/removeFromCategory", {category: $scope.contextTagsTemp[index], tileId: $scope.currentTile._id});
      //console.log("test");
      //console.log(tile._id);
      $scope.contextTagsTemp.splice(index, 1);
    };

    //deletes a word
    $scope.removeWord = function(index) {
      $scope.wordToRemove = $scope.userTiles[index];
      $http.delete('/api/tile/'+ $scope.wordToRemove._id);
      $scope.getWords();
      var wordToRemove = $scope.userTiles(index);
      $scope.userTiles.splice(index,1);
      for(var i = 0; i < $scope.allTiles.length; i++){
        if(wordToRemove.id == $scope.allTiles[i].id) {
            $scope.allTiles.splice(i,1);
          }
      }
    };

    $scope.editWord = function(index){
        $scope.editWordIndex = index;
        $scope.showValue = false;
        $scope.wordToEdit = $scope.userTiles[index];
    };

    $scope.updateTile = function() {

        $scope.showValue = true;
    }

  });
















//Usefull database functions from previous iteration


//exports.removeTileFromCategory = function(req, res, next) {
//  var userId = req.user._id;
//
//  var word = req.body.word;
//  var packId = req.body.packId;
//  User.findById(userId, function (err, user) {
//    for(var i = 0; i < user.tileBucket.length; i++){
//      console.log(word == user.tileBucket[i].wordName);
//      if(word == user.tileBucket[i].wordName){
//        console.log(word);
//        for(var j = 0; j < user.tileBucket[i].tileTags.length; j++){
//          if(user.tileBucket[i].tileTags[j] == packId){
//            console.log(j);
//            user.tileBucket[i].tileTags.splice(j, 1);
//          }
//        }
//      }
//    }
//    user.save(function(err) {
//      if (err) return validationError(res, err);
//      res.send(200);
//    });
//  });
//};


//exports.updatePack = function(req, res, next) {
//  var userId = req.user._id;
//
//  var tagName = req.body.tagName;
//  var packType = req.body.packType;
//
//  User.findById(userId, function (err, user) {
//    user.tileTags.push({"tagName": tagName, "tagType": packType});
//    user.save(function(err) {
//      if (err) return validationError(res, err);
//      res.send(200);
//    });
//  });
//};

//exports.updateTile = function(req, res, next) {
//  var userId = req.user._id;
//
//  var word = req.body.word;
//  var packId = req.body.packId;
//
//  User.findById(userId, function (err, user) {
//    var found = false;
//    for(var i = 0; i < user.tileBucket.length; i++){
//      if(user.tileBucket[i].wordName == word){
//        found = true;
//        user.tileBucket[i].tileTags.push(packId);
//      }
//    }
//    if(!found){
//      user.tileBucket.push({wordName: word, tileTags: [packId]});
//    }
//    user.save(function(err) {
//      if (err) return validationError(res, err);
//      res.send(200);
//    });
//  });
//};
