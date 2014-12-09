"use strict";

app.controller('DatePickerCtrl', [ '$location', '$rootScope', '$route', 'getdataservice', '$scope','DateService' ,function ( $location,$rootScope, $route, getdataservice, $scope, DateService) {
//	Ctrl uses scope in order to use it in directive

  $scope.plannerList = $scope.$parent.Overview.planners.Products;
  $scope.laeremidler = [];
  $scope.niveau = [];

  $scope.levelAsKeys = {};
  $scope.subjectAsKeys = {};


  console.log($scope.plannerList);
  angular.forEach($scope.plannerList, function(plannerdata){
    angular.forEach(plannerdata.Planners, function(planner){

      // parse subject from ID
      var subject = planner.ID.slice(0, planner.ID.search(/\_/));

      // store level as value array elements with laeremiddel as key
      if(angular.isDefined($scope.subjectAsKeys[subject])){
        $scope.subjectAsKeys[subject].push(planner.Level);
      } else {
        $scope.subjectAsKeys[subject] = [planner.Level];
      }

      // store laeremiddel as value array elements with level as key
      if(angular.isDefined($scope.levelAsKeys[planner.Level])){
        $scope.levelAsKeys[planner.Level].push(planner.ID);
      } else {
        $scope.levelAsKeys[planner.Level] = [planner.ID];
      }


      // parse and store laeremiddel in $scope.laeremidler if it doen't exist yet
      var unique = true;
      angular.forEach($scope.laeremidler, function(laeremiddel){
        if(laeremiddel == planner.ID.slice(0, planner.ID.search(/\_/))){
          unique = false;
        }
      });
      // store laeremiddel if it's unique
      if(unique){
        // parse laeremiddel
        var laeremiddel = planner.ID.slice(0, planner.ID.search(/\_/));
        $scope.laeremidler.push(laeremiddel);

      }

/*      // store level in $scope.niveau if it doen't exist yet
      var uniqueLevel = true;
      angular.forEach($scope.niveau, function(niveau){
        if(niveau == planner.Level){
          uniqueLevel = false;
        }
      });
      // store laeremiddel if it's unique
      if(uniqueLevel){
        $scope.niveau.push(planner.Level);

      }*/
    });
  });

  //$scope.laeremidler = ['geografi', 'biologi', 'sociologi', 'test', 'hmmm', 'bla', 'blaaa', 'blaaaaa'];
  //$scope.niveau = ['7-9 klasse'];



  //On create report click
	$scope.createPlanner = function(){

    //If niveau and laeremiddel are defined as well as title, contact server
    if(angular.isDefined($scope.valgtNiveau && $scope.valgtLaeremiddel && $scope.title)){

      //ready planner data
      var planData = {
        "title": $scope.title,
        "ID": $scope.valgtLaeremiddel+"_"+$scope.valgtNiveau.replace(' klasse',''),
        "laeremiddel": $scope.valgtLaeremiddel,
        "niveau": $scope.valgtNiveau,
        "version": "FM 2014"
      };

      //save planner

      console.log(planData);

      // close dialog
      $rootScope.dialog = false;


		}
	}

}]);