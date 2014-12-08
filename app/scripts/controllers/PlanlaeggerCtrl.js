"use strict";

app.controller('PlanlaeggerCtrl', [ 'plannerData', 'planner', '$rootScope', '$location', 'getdataservice', '$scope', '$route', function (plannerData, planner, $rootScope, $location, getdataservice, $scope, $route) {

  //Save reference to controller in order to avoid reference soup
  var Plan = this;

  // current planner
  Plan.current = planner.data;

  Plan.plandata = angular.fromJson(plannerData.data);


  Plan.dropdownDummyData = ['element1','element2','element3','element4','element5','element6']
  Plan.levels = Plan.dropdownDummyData;
  Plan.courses = Plan.dropdownDummyData;


// angular drag drop test
  Plan.pannerTitle = "";
  Plan.selected= [];

  Plan.addText = "";


  Plan.dropSuccessHandler = function($event,index,array){
    console.log(index);
  };

  Plan.onDrop = function($event,$data,array){
    alert($data);
  };


}]);