"use strict";

app.controller('PlanlaeggerCtrl', [  'planner', '$rootScope', '$location', 'getdataservice', '$scope', '$route', function (  planner, $rootScope, $location, getdataservice, $scope, $route) {

  //Save reference to controller in order to avoid reference soup
  var Plan = this;

  // set loading view while getting plannerdata
  $rootScope.loadingView = true;

  // setup api data variables
  Plan.current = planner.data;

  // get the raw planner data from the plannerId in the user-defined planner
  getdataservice.getPlanner(angular.fromJson(Plan.current.content).plannerID).then(function(data){
    // remove loading view when planner is loaded
    $rootScope.loadingView = false;

    Plan.plandata = angular.fromJson(data.data);

    // setup current planner variables
    Plan.levels = [];
    Plan.courses = [];
    Plan.sortedCourses = [];
    Plan.topics = [];
    Plan.checkList = {};
    Plan.highlighted = {};
    Plan.popoverGoals = [];

    // set page title
    $rootScope.title = "Gyldendal Planlægger | " + Plan.current.title;

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

// initialize selected courses from current planner data
    Plan.selected = [];
    angular.forEach(angular.fromJson(planner.data.content).courses, function(courseID){
      angular.forEach(Plan.courses, function(course){
        if(courseObj.id == courseID){
          Plan.selected.push(course);
        }
      })
    });

  });


// function for toggling highlighted id's

  Plan.highlight = function(id){
    if(angular.isDefined(Plan.highlighted[id])){
      delete Plan.highlighted[id];
    } else {
      Plan.highlighted[id] = true;
    }
    angular.forEach(Plan.courses, function(course){

      var highlight = false;

      angular.forEach(course.goals.goal, function(goal){
        // parse current goal's scopes and check for match in Plan.highlighted object
        var tempScope = goal.scope;
        // set up regexp to find numbers in 'scope' string
        var regexp = "[0-9]+";
        var re = new RegExp(regexp, "i");
        // find each scope, match it and remove it from tempScope
        while (tempScope.search(re) != -1) {
          var currentScope = re.exec(tempScope)[0];
          if(Plan.highlighted[goal.id+currentScope]){
            highlight = true;
          }
          tempScope = tempScope.replace(currentScope, '');
        }
        // match current goal id with Plan.highlighted object
        if(Plan.highlighted[goal.id]){
          highlight = true;
        }
      });
    // set highlight property on current course
      if(highlight){
        course.highlight = true;
      } else {
        course.highlight = false;
      }
    });
    //Plan.sortCourses();

  };




// function for setting the Plan.sortedCourses array in the view
  Plan.sortCourses = function(){

    if(angular.isDefined(Plan.selectedCourse)){
      Plan.sortedCourses = Plan.setTopic(Plan.selectedCourse);
    } else {
      Plan.sortedCourses = Plan.courses;
    }

    // removes level dropdown
/*    if(angular.isDefined(Plan.selectedCourse)){
      Plan.sortedCourses = Plan.setLevel(Plan.setTopic(Plan.selectedCourse));
    } else {
      Plan.sortedCourses = Plan.setLevel(Plan.courses);
    }*/
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
// Removes coures id and course goals from checkList
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
    setAllChecks();
  };

  // helperfunction takes goal.id and scope and sets Plan.popoverGoals array with all matching courses as [{topic-name, course-name}, ...]
  Plan.setPopoverGoals = function(id, scope){
    // empty popover array
    Plan.popoverGoals = [];

    // loop through topics
    angular.forEach(Plan.topics, function(topic){
      //checks if topic.courses.course is array or object
      if(angular.isDefined(topic.courses.course.length)) {
        angular.forEach(topic.courses.course, function (course) {
          angular.forEach(course.goals.goal, function(goal){
            if (goal.id == id && goal.scope.search(scope) != -1) {
              var obj = {
                topic: topic.value,
                course: course.value
              };
              Plan.popoverGoals.push(obj);
            }
          });
        });
      } else {
        angular.forEach(topic.courses.course.goals.goal, function(goal){
          if (goal.id == id && goal.scope.search(scope) != -1) {
            var obj = {
              topic: topic.value,
              course: topic.courses.course.value
            };
            Plan.popoverGoals.push(obj);
          }
        });
      }
    });
  };

  // helperfunction takes course.id and returns course topic
  Plan.getTopic = function(id){
    var courseTopic = '';
    angular.forEach(Plan.topics, function(topic){
      //checks if topic.courses.course is array or object
      if(angular.isDefined(topic.courses.course.length)) {
        angular.forEach(topic.courses.course, function (course) {
          if (course.id == id) {
            courseTopic = topic;
          }
        });
      } else {
        if (topic.courses.course.id == id) {
          courseTopic = topic;
        }
      }
    });
    return courseTopic
  };

  // helperfunction takes goal.id and returns goal info
  Plan.getGoal = function(id){
    var goalInfo = '';
    angular.forEach(Plan.plandata.planlaegger.kompetenceomraader.kompetenceomraade, function(omraade){
      angular.forEach(omraade.faerdighedsOgVidensmaalPLURALIS.faerdighedsOgvidensmaalSINGULARIS, function(vidensmaal){
        if(vidensmaal.id == id){
          goalInfo = vidensmaal;

        }
      });
    });
    return goalInfo
  };

  // helperfunction takes goal.id and returns goal category info
  Plan.getGoalCategory = function(id){
    var goalInfo = '';
    angular.forEach(Plan.plandata.planlaegger.kompetenceomraader.kompetenceomraade, function(omraade){
      angular.forEach(omraade.faerdighedsOgVidensmaalPLURALIS.faerdighedsOgvidensmaalSINGULARIS, function(vidensmaal){
        if(vidensmaal.id == id){
          goalInfo = omraade;

        }
      });
    });
    return goalInfo
  };

  // helperfunction that loops through 'kompetenceomraader' and sets up .checked values for all goal elements
  var setAllChecks = function(){
    angular.forEach(Plan.plandata.planlaegger.kompetenceomraader.kompetenceomraade, function(omraade){

      // setup var to determine check status
      var checkedTopElement = false;

      // loop through sub-elements
      angular.forEach(omraade.faerdighedsOgVidensmaalPLURALIS.faerdighedsOgvidensmaalSINGULARIS, function(vidensmaal){

        // check if buttom-level element 'vidensmaal.faser.fase' is not array
        //loop through buttom-level elements
        angular.forEach(vidensmaal.faser.fase, function(fase){
          if(!angular.isDefined(vidensmaal.faser.fase.length)){
            // vidensmaal.faser.fase is not an array
            //use vidensmaal.faser.fase instead of fase
            var checkedElement = false;
            angular.forEach(Plan.checkList[vidensmaal.id], function (couseID) {
              angular.forEach(Plan.selected, function (course) {
                if (angular.isDefined(couseID[course.id])) {
                  if (couseID[course.id][vidensmaal.faser.fase.scope]) {
                    checkedElement = true;
                  }
                }
              });
            });
            // set buttom-level element's check status in relation to Plan.checkList
            if (checkedElement) {
              vidensmaal.faser.fase.checked = true;
            } else {
              vidensmaal.faser.fase.checked = false;
            }

          } else {
            var checkedElement = false;
            angular.forEach(Plan.checkList[vidensmaal.id], function (couseID) {
              angular.forEach(Plan.selected, function (course) {
                if (angular.isDefined(couseID[course.id])) {
                  if (couseID[course.id][fase.scope]) {
                    checkedElement = true;
                  }
                }
              });
            });
            // set buttom-level element's check status in relation to Plan.checkList
            if (checkedElement) {
              fase.checked = true;
            } else {
              fase.checked = false;
            }
          }
        });


        // set sub element's check status in relation to Plan.checkList[id]
        if(Plan.checkList[vidensmaal.id]){
          // check status of this element
          vidensmaal.checked = true;
          // check status of parrent element
          checkedTopElement = true;
        } else {
          vidensmaal.checked = false;
        }
      });

      // set top element's check status
      if(checkedTopElement){
        omraade.checked = true;
      } else {
        omraade.checked = false;
      }
    });
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


         // parse and store goal scope
          var scopes = {};
          var tempScope = goal.scope;
          // set up regexp to find numbers in 'levels' string
          var regexp = "[0-9]+";
          var re = new RegExp(regexp, "i");

          // find and replace
          while (tempScope.search(re) != -1) {
            var currentScope = re.exec(tempScope)[0];
            scopes[currentScope] = true;
            tempScope = tempScope.replace(currentScope, '');
          }
/*          Plan.checkList[goal.id][course.id] = scopes;
          console.log(Plan.checkList[goal.id]);*/
          var tempobejct = {};
          tempobejct[course.id] = scopes;

          // initialize new array at Plan.checkList[goal.id] if it doesn't exist already
          if(angular.isDefined(Plan.checkList[goal.id])){

            Plan.checkList[goal.id].push(tempobejct);
          } else {
            Plan.checkList[goal.id] = [];
            Plan.checkList[goal.id].push(tempobejct);
          }
        });
      }
    });
    // re-sort sorted course list to update view
    Plan.sortCourses();

    // set all check values
    console.log(Plan.checkList)
    setAllChecks();
  };

  Plan.onDrop = function($event,$data,array){
    array.push($data);
    console.log(Plan.selected)
  };

  Plan.drag = function($event,$data,array){
    //array.push($data);
    console.log("DRAG!!!!!")
    hidePopover();
  };

}]);