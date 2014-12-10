"use strict";

app.controller('PlanlaeggerCtrl', [ 'plannerData', 'planner', '$rootScope', '$location', 'getdataservice', '$scope', '$route', function (plannerData, planner, $rootScope, $location, getdataservice, $scope, $route) {

  //Save reference to controller in order to avoid reference soup
  var Plan = this;

  // setup api data variables
  Plan.current = planner.data;
  Plan.plandata = angular.fromJson(plannerData.data);

  // setup current planner variables
  Plan.levels = [];
  Plan.courses = [];
  Plan.sortedCourses = [];
  Plan.topics = [];
  Plan.checkList = {};

  // Set levels: Search through plandata and set available course levels
  angular.forEach(Plan.plandata.planlaegger.topics.topic, function(topic){

    Plan.topics.push(topic);

    // parse levels and courses if planlaegger.topics.topic.courses is an array
    if(angular.isDefined(topic.courses.length)){
      angular.forEach(topic.courses, function(course){
        var levels = course.levels;

        // set up regexp to find numbers in 'levels' string
        var regexp = "[0-9]+";
        var re = new RegExp(regexp, "i");

        // find and replace
        while (levels.search(re) != -1) {
          var unique = true;
          var currentLevel = re.exec(levels)[0];
          if (!Plan.levels.length) {
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
    } else {
    // parse levels and courses if planlaegger.topics.topic.courses is NOT an array

      Plan.courses.push(topic.courses.course);
      var levels = topic.courses.course.levels;

      // set up regexp to find numbers in 'levels' string
      var regexp = "[0-9]+";
      var re = new RegExp(regexp, "i");
      // find and replace
      while (levels.search(re) != -1) {
        var unique = true;
        var currentLevel = re.exec(levels)[0];
        if (!Plan.levels.length) {
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
    }
  });

  // initialize Plan.sortedCourses to be equal to all courses
  Plan.sortedCourses = Plan.courses;


// Set courses: Search through plandata and set available course values
  angular.forEach(Plan.plandata.planlaegger.kompetenceomraader.kompetenceomraade, function(area){
    angular.forEach(area.faerdighedsOgVidensmaalPLURALIS.faerdighedsOgvidensmaalSINGULARIS, function(goals){

    });
  });




  Plan.dropdownDummyData = ['element1','element2','element3','element4','element5','element6']


// angular drag drop test
  Plan.pannerTitle = "";
  Plan.selected = [];

  Plan.addText = "";


  Plan.sortCourses = function(){
    if(angular.isDefined(Plan.selectedCourse)){
      Plan.sortedCourses = Plan.setLevel(Plan.setTopic(Plan.selectedCourse));
    } else {
      Plan.sortedCourses = Plan.setLevel(Plan.courses);
    }
  };


// function for sorting displayed course list
// Takes a topic that contains relevant courses
  Plan.setTopic = function(topic){
    var sortedCourses = [];
    if( topic == 'Alle forløb'){
      sortedCourses = Plan.courses;
    } else {
      // loop through courses in topic to get course list
      angular.forEach(topic.courses, function (course) {
        sortedCourses.push(course);
      });
    }
    return sortedCourses
  };

// helper function for sorting displayed course list
// Takes an array of courses to sort in relation to selectedLevel if defined
// Returns sorted course array
  Plan.setLevel = function(courses){
    if(angular.isDefined(Plan.selectedLevel)) {
      var sortedCourses = [];
      if (Plan.selectedLevel == 'Alle klassetrin') {
        return courses;
      } else {
        // loop through courses in topic to get course list
        angular.forEach(courses, function (course) {
          if(course.levels.search(Plan.selectedLevel) != -1 ){
            sortedCourses.push(course);
          }
        });
        return sortedCourses
      }
    } else {
      return courses
    }
  };

// Function for clearing selected course
  Plan.clearSelected = function(course){

  // remove course from selected array
    for(var i = 0; i < Plan.selected.length; i++){
      if(Plan.selected[i].id == course.id) {
        Plan.selected.splice(i, 1);
      }
    }

  // remove course id and goals from checklist
    delete Plan.checkList[course.id];
    angular.forEach(course.goals.goal, function(goal) {
      if(Plan.checkList[goal.id].length == 1){
        delete Plan.checkList[goal.id];
      } else {
        var index = Plan.checkList[goal.id].indexOf(course.id);
        Plan.checkList[goal.id].splice(index, 1);
      }
    });
    console.log(Plan.checkList)

  };


// ----------  Drag and drop functionality ------
  Plan.dropSuccessHandler = function($event,index,course,array){
    // set checkmark on all instances of selected course, and its goals
    // loop all courses to find course with matching id
    angular.forEach(array, function(aCourse){
      // when match, add course.id and all course goals id and scope to checkList. Goals as array with course.id
      if(aCourse.id == course.id){
        Plan.checkList[course.id] = true;
        angular.forEach(course.goals.goal, function(goal){
          // initialize new array at Plan.checkList[goal.id] if it doesn't exist already
          if(angular.isDefined(Plan.checkList[goal.id])){
            Plan.checkList[goal.id].push(course.id);

          } else {
            Plan.checkList[goal.id] = [];
            Plan.checkList[goal.id].push(course.id);
          }
        });
      }
    });
    // re-sort sorted course list to update view
    Plan.sortCourses();

    console.log(Plan.checkList)

  };

  Plan.onDrop = function($event,$data,array){
    array.push($data);
    console.log(Plan.selected)
  };


}]);