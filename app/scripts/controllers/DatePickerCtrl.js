"use strict";

app.controller('DatePickerCtrl', ['$location', '$rootScope', '$route', 'getdataservice', '$scope','DateService' ,function ($location,$rootScope, $route, getdataservice, $scope, DateService) {
//	Ctrl uses scope in order to use it in directive


  $scope.laeremidler = ['geografi', 'biologi', 'sociologi', 'test', 'hmmm', 'bla', 'blaaa', 'blaaaaa'];
  $scope.niveau = ['7-9 klasse'];



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