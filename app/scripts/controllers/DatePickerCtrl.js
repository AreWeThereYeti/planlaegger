"use strict";

app.controller('DatePickerCtrl', [ '$location', '$rootScope', '$route', 'getdataservice', '$scope','DateService' ,function ( $location,$rootScope, $route, getdataservice, $scope, DateService) {
//	Ctrl uses scope in order to use it in directive


  $scope.plannerList = $scope.$parent.Overview.planners.Products;
  $scope.laeremidler = [];
  $scope.niveau = [];

  $scope.selectedPlannerID = '';

  $scope.levelAsKeys = {};
  $scope.subjectAsKeys = {};
  $scope.title = '';


  angular.forEach($scope.plannerList, function(plannerdata){

    // the following ignores planners with unfinished planner data. Remove when data sets are ready and available
    if(plannerdata.Url == "engelsk0-2.gyldendal.dk" || plannerdata.Url == "engelsk.gyldendal.dk" || plannerdata.Url == "matematik.gyldendal.dk"){
      return
    }

    // store url in laeremiddel array
    $scope.laeremidler.push(plannerdata.Url);

    // store planners (level and ID) in relation to planner url
    angular.forEach(plannerdata.Planners, function(planner){

      var subject = plannerdata.Url;

      // store level as value array elements with laeremiddel as key
      if(angular.isDefined($scope.subjectAsKeys[subject])){
        $scope.subjectAsKeys[subject].push(planner);
      } else {
        $scope.subjectAsKeys[subject] = [planner];
      }

      // store laeremiddel as value array elements with level as key
      if(angular.isDefined($scope.levelAsKeys[planner.Level])){
        $scope.levelAsKeys[planner.Level].push(planner.ID);
      } else {
        $scope.levelAsKeys[planner.Level] = [planner.ID];
      }


    });
  });

  if($rootScope.popup){
    $scope.valgtLaeremiddel = $route.current.params.product;
    if($scope.subjectAsKeys[$scope.valgtLaeremiddel] && $scope.subjectAsKeys[$scope.valgtLaeremiddel].length) {
      $scope.valgtNiveau = $scope.subjectAsKeys[$scope.valgtLaeremiddel][0].Level;
    }
  }

  //On create report click
	$scope.createPlanner = function(){
    //If niveau and laeremiddel are defined as well as title, contact server
    if($scope.selectedPlannerID && angular.isDefined($scope.valgtNiveau) && angular.isDefined($scope.valgtLaeremiddel) && $scope.title){

      //ready planner data
      var planData = {
        "title": $scope.title,
        "subjects": [$scope.valgtLaeremiddel],
        "levels": [$scope.valgtNiveau],

        "content": {
          "data": [],
          "courses": [],
          "goals": [],
          "plannerID": $scope.selectedPlannerID
        }
      };

      //save planner
      getdataservice.addOrganizer(planData).then(function(data){

        if($rootScope.popup){
          // if planner was created from popup: go to the new planner
          //TODO: add check to make sure that data.data == ""someValue""
          var plannerID = data.data.slice(1,-1);
          $location.path("/planner/"+plannerID).search({userID: $route.current.params.userID});
          $rootScope.popup = false;
        }else {
          // else from dialog: close dialog and reload view
          $rootScope.dialog = false;
          $route.reload();
        }
      });




		}
	}

}]);