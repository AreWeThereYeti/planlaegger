"use strict";

app.controller('PlanlaeggerCtrl', [ 'plannerData', 'planner', '$rootScope', '$location', 'getdataservice', '$scope', '$route', function (plannerData, planner, $rootScope, $location, getdataservice, $scope, $route) {

  //Save reference to controller in order to avoid reference soup
  var Plan = this;

  // current planner
  Plan.current = planner.data;

  Plan.plandata = angular.fromJson(plannerData.data);
  Plan.levels = [];
  Plan.courses = [];

  // Set levels and courses: Search through plandata and set available course levels

  angular.forEach(Plan.plandata.planlaegger.topics.topic, function(topic){
    var levels = topic.courses.course.levels;

    Plan.courses.push(topic);

    // set up regexp to find numbers in 'levels' string
    var regexp = "[0-9]+";
    var re = new RegExp(regexp, "i");
    // find and replace
    while(levels.search(re) != -1) {
      var unique = true;
      var currentLevel = re.exec(levels)[0];
      if(!Plan.levels.length){
        Plan.levels.push(currentLevel);
      } else {
        angular.forEach(Plan.levels, function (level) {
          if (level == currentLevel) {
            unique = false;
          }
        });

        if (unique) {
          Plan.levels.push(currentLevel);
        }
      }
      levels = levels.replace(currentLevel, '');
    }

  });

  Plan.dropdownDummyData = ['element1','element2','element3','element4','element5','element6']


// angular drag drop test
  Plan.pannerTitle = "";
  Plan.selected = [];

  Plan.addText = "";

// Function for clearing selected courses
  Plan.clearSelected = function(){
    Plan.selected = [];

  };


// ----------  Drag and drop functionality ------
  Plan.dropSuccessHandler = function($event,index,array){
    console.log(index);
  };

  Plan.onDrop = function($event,$data,array){
    array.push($data);
    console.log(Plan.selected)
  };


}]);