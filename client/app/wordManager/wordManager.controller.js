'use strict';

angular.module('WordRiverApp')
  .controller('WordManagerCtrl', function ($scope, $http, socket, Auth) {
    $scope.categoryField = "";
    $scope.addField = "";
    $scope.addType = "";
    $scope.searchField = "";
    $scope.categoryArray = [];
    $scope.currentUser = Auth.getCurrentUser();
    $scope.selectedCategories = [];
    $scope.allTiles = [];
    $scope.userTiles = [];
    $scope.matchTiles = [];
    $scope.toSort = "tile";
    $scope.order = true;
    $scope.currentCategory = null;
    //$scope.selectedCategories = [];

    $scope.confirmDelete = function(index) {
      this.index = index;
      if (confirm("Are you sure you want to delete " + $scope.categoryArray[index] + "?") == true) {
        $scope.removeCategory(index);
      }
    };

    $scope.disassociateTile = function(pack, index) {
      console.log(pack);
      $http.put('/api/users/' + $scope.userId + "/deleteTile", {word: pack.tiles[index].wordName, packId: pack._id});
      pack.tiles.splice(index, 1);
      //$http.post('/api/packs', {packName: pack.packName, tiles: pack.tiles});
      //$http.delete('/api/packs/' + pack._id);
    };

    $scope.getCategories = function() {
        $scope.categoryArray = $scope.currentUser.contextPacks;
      };

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


    //cat is short for category
    $scope.displayCatInfo = function (category) {
      $scope.userTiles = [];
      $scope.matchTiles = [];
      $scope.currentCategory = category;
      $http.get('/api/tile').success(function (allTiles) {
        $scope.allCatTiles = allTiles;
        for (var i = 0; i < $scope.allCatTiles.length; i++) {
          if ($scope.currentUser._id == $scope.allCatTiles[i].creatorID) {
            $scope.userTiles.push($scope.allCatTiles[i]);
          }
        }
        for (var j = 0; j < $scope.userTiles.length; j++) {
          for (var z = 0; z < $scope.userTiles[j].contextTags.length; z++) {
            if ($scope.userTiles[j].contextTags[z].tagName == category) {
              $scope.matchTiles.push($scope.userTiles[j]);
              //console.log($scope.userTiles[j].name);
            }
          }
        }
        if ($scope.matchTiles.length > 0) {
          //alert("The tiles in the category " + category + " are:\n" + $scope.matchTiles.join('\n'));
          //document.getElementById("displayContextWords").innerHTML = "<li class=\"list-group-item\" ng-repeat=\"word in matchTiles\"> <label> {{word}}</label> </li>" ;
          <!--<input type=\"checkbox\" value=\"value\" ng-click=\"\"-->
        } else {
          alert("There are no tiles in this category");
        }
      });
    };



    //THIS IS THE FUNCTION WE ARE WORKING ON - 4/14/15
    $scope.removeFromCategory = function (tile) {
      console.log('1 of 3');
      for(var i = 0; i < $scope.matchTiles.length; i++){
        console.log('2 of 3');
        //console.log($scope.matchTiles.length);
        if(tile._id == $scope.matchTiles[i]._id){
          console.log('3 of 3');
          $scope.matchTiles.splice(i, 1);
        }
      }
    };



      $scope.displayWordInfo = function (word) {
        $scope.contextTagsTemp = [];
        for(var i =0; i<$scope.allTiles.length; i++){
          if($scope.allTiles[i].name == word.name){
            if($scope.allTiles[i].contextTags.length > 0) {
              for (var j = 0; j < $scope.allTiles[i].contextTags.length; j++){
                $scope.contextTagsTemp.push($scope.allTiles[i].contextTags[j].tagName);
              }
              alert("This tile has the categories:\n" + $scope.contextTagsTemp.join('\n'));
            }
            else{
              alert("This tile has no categories.");
            }
          }
        }
      };

    $scope.removeCategory = function(index) {
      $scope.categoryArray.splice(index, 1);
      $http.patch('/api/users/'+$scope.currentUser._id+'/category',{
        contextPacks : $scope.categoryArray
      });
    };

    $scope.removeWord = function(index) {
      $scope.wordToRemove = $scope.userTiles[index];
      $http.delete('/api/tile/'+ $scope.wordToRemove._id);
      $scope.getWords();
    };
  });


//exports.deleteTile = function(req, res, next) {
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
