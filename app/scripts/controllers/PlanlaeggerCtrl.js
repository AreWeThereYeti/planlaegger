"use strict";

app.controller('PlanlaeggerCtrl', ['$timeout', 'colorPickerService', 'planner', '$rootScope', '$location', 'getdataservice', '$scope', '$route', '$routeParams', function ($timeout, colorPickerService, planner, $rootScope, $location, getdataservice, $scope, $route, $routeParams) {

  //Save reference to controller in order to avoid reference soup
  var Plan = this;

  // set loading view while getting plannerdata
  $rootScope.loadingView = true;

  // setup api data variables
  Plan.current = planner.data;
  $rootScope.current = planner.data;
  // set base planner color from product id
  $rootScope.baseColor = colorPickerService.getColor($rootScope.current.subjects[0]);
  $rootScope.hoverColor = "{color: "+colorPickerService.getColor($rootScope.current.subjects[0])+"}";


  // get the raw planner data from the plannerId in the user-defined planner
  getdataservice.getPlanner(angular.fromJson(Plan.current.content).plannerID).then(function(data){
    // remove loading view when planner is loaded
    $timeout(function(){
      $rootScope.loadingView = false
    });

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

    // change planner goal data object bottom element to array if they are obojects to fix data inconsistency
    angular.forEach(Plan.plandata.planlaegger.kompetenceomraader.kompetenceomraade, function(elem){
      angular.forEach(elem.faerdighedsOgVidensmaalPLURALIS.faerdighedsOgvidensmaalSINGULARIS, function(subelem){
        if(angular.isUndefined(subelem.faser.fase.length)){
          subelem.faser.fase = [subelem.faser.fase];
        }
      })
    });

    // Set levels: Search through plandata and set available course levels
    angular.forEach(Plan.plandata.planlaegger.topics.topic, function(topic){

      // check if topic has redundant id
      var topicIndex = null;
      for(var i = 0; i < Plan.topics.length; i++){
        if(Plan.topics[i].id == topic.id){
          topicIndex = i;
        }
      }

      if(topicIndex == null){
        if(angular.isDefined(topic.courses.length)){
          Plan.topics.push(topic);
        } else{
          topic.courses = [topic.courses.course];
          Plan.topics.push(topic);

        }
      }

      // parse levels and courses if planlaegger.topics.topic.courses is an array
      if(angular.isDefined(topic.courses.length)){
        angular.forEach(topic.courses, function(course){

          if(topicIndex != null){
            Plan.topics[topicIndex].courses.push(topic);
          }

          // check for duplicate courses
          var duplicate = false;
          angular.forEach(Plan.courses, function(existingCourse){
            if(existingCourse.id == course.id){
              duplicate = true;
            }
          });
          if(!duplicate){
            Plan.courses.push(course);
          }

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

        if(topicIndex != null){
          Plan.topics[topicIndex].courses.push(topic.courses.course);
        }

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
        if(course.id == courseID){
          Plan.selected.push(course);
        }
      })
    });




    // set checkmark on all instances of selected course, and its goals
    // loop all courses to find course with matching id
    angular.forEach(Plan.courses,function(course) {
      angular.forEach(Plan.selected, function (aCourse) {
        // when match, add course.id and all course goals id and scope to checkList. Goals as array with course.id
        if (aCourse.id == course.id) {
          Plan.checkList[course.id] = true;

          // parse levels and courses if courses.goals.goal is an array
          if(angular.isDefined(course.goals.goal.length)) {
            angular.forEach(course.goals.goal, function (goal) {


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

              var tempobejct = {};
              tempobejct[course.id] = scopes;

              // initialize new array at Plan.checkList[goal.id] if it doesn't exist already
              if (angular.isDefined(Plan.checkList[goal.id])) {

                Plan.checkList[goal.id].push(tempobejct);
              } else {
                Plan.checkList[goal.id] = [];
                Plan.checkList[goal.id].push(tempobejct);
              }
            });
          } else {

              // parse and store goal scope
              var scopes = {};
              var tempScope = course.goals.goal.scope;
              // set up regexp to find numbers in 'levels' string
              var regexp = "[0-9]+";
              var re = new RegExp(regexp, "i");

              // find and replace
              while (tempScope.search(re) != -1) {
                var currentScope = re.exec(tempScope)[0];
                scopes[currentScope] = true;
                tempScope = tempScope.replace(currentScope, '');
              }

              var tempobejct = {};
              tempobejct[course.id] = scopes;

              // initialize new array at Plan.checkList[goal.id] if it doesn't exist already
              if (angular.isDefined(Plan.checkList[course.goals.goal.id])) {

                Plan.checkList[course.goals.goal.id].push(tempobejct);
              } else {
                Plan.checkList[course.goals.goal.id] = [];
                Plan.checkList[course.goals.goal.id].push(tempobejct);
              }
          }
        }
      });
    });

    // re-sort sorted course list to update view
    Plan.sortCourses();

    // set all check values
    setAllChecks();

  });

  // goal list helper function: deselects all child elements if parent element is seleceted
  Plan.toggleSubelements = function(element){

    if(element.Selected == false || angular.isUndefined(element.Selected)){
      angular.forEach(element.faser.fase, function(subelement){
        subelement.Selected = false;
      });
    }
  };
  // goal list helper function: selects parent element if all sub elements are seleceted
  Plan.toggleParentelements = function(element){

    if(angular.isDefined(element.faser.fase.length)){
      var allSelected = true;
      for(var i = 1; i <= element.faser.fase.length; i++){
        if(!Plan.highlighted[element.id+i]){
          allSelected = false;
        }
      }
      return allSelected;
    }
    return false;

  };


// function for toggling highlighted id's

  Plan.highlight = function(id, parent, parentElem){
    if(angular.isDefined(Plan.highlighted[id]) && parent){
      delete Plan.highlighted[id];
      delete Plan.highlighted[id+"1"];
      delete Plan.highlighted[id+"2"];
      delete Plan.highlighted[id+"3"];

    } else if(angular.isDefined(Plan.highlighted[id])){
      delete Plan.highlighted[id];

    } else if(parent){
      Plan.highlighted[id] = true;
      // removes child highlights if parent is highlighted
      if(angular.isDefined(Plan.highlighted[id+"1"])){
        delete Plan.highlighted[id+"1"];
      }
      if(angular.isDefined(Plan.highlighted[id+"2"])){
        delete Plan.highlighted[id+"2"];
      }
      if(angular.isDefined(Plan.highlighted[id+"3"])){
        delete Plan.highlighted[id+"3"];
      }

    } else {
      Plan.highlighted[id] = true;
      // removes parent highlight if child is highlighted
      if(angular.isDefined(Plan.highlighted[id.slice(0, - 1)])){
        delete Plan.highlighted[id.slice(0, - 1)];
        parentElem.Selected = false;
      }

    }
    angular.forEach(Plan.courses, function(course){

      //clones Plan.highlighted as temporary checklist, to be able to delete goals when they are matched
      var highlightChecklist = JSON.parse(JSON.stringify(Plan.highlighted));

      // parse levels and courses if courses.goals.goal is an array
      if(angular.isDefined(course.goals.goal.length)) {
        angular.forEach(course.goals.goal, function (goal) {
          // parse current goal's scopes and check for match in temp highlightChecklist object
          var tempScope = goal.scope;
          // set up regexp to find numbers in 'scope' string
          var regexp = "[0-9]+";
          var re = new RegExp(regexp, "i");
          // find each scope, match it and remove it from tempScope
          while (tempScope.search(re) != -1) {
            var currentScope = re.exec(tempScope)[0];
            // if goal id is present in highlightChecklist, delete it for the list
            if (highlightChecklist[goal.id + currentScope]) {
              delete highlightChecklist[goal.id + currentScope];
            }
            tempScope = tempScope.replace(currentScope, '');
          }
          // match current goal id with highlightChecklist object
          if (highlightChecklist[goal.id]) {
            delete highlightChecklist[goal.id];
          }
        });
      } else{
        // parse current goal's scopes and check for match in temp highlightChecklist object
        var tempScope = course.goals.goal.scope;
        // set up regexp to find numbers in 'scope' string
        var regexp = "[0-9]+";
        var re = new RegExp(regexp, "i");
        // find each scope, match it and remove it from tempScope
        while (tempScope.search(re) != -1) {
          var currentScope = re.exec(tempScope)[0];
          // if goal id is present in highlightChecklist, delete it for the list
          if (highlightChecklist[course.goals.goal.id + currentScope]) {
            delete highlightChecklist[course.goals.goal.id + currentScope]
          }
          tempScope = tempScope.replace(currentScope, '');
        }
        // match current goal id with highlightChecklist object
        if (highlightChecklist[course.goals.goal.id]) {
          delete highlightChecklist[course.goals.goal.id];
        }
      }
    // all goal id in highlightChecklist has been found (and deleted), set highlight property on current course
      if(Object.keys(highlightChecklist).length || !Object.keys(Plan.highlighted).length){
        course.highlight = false;
      } else {
        course.highlight = true;
      }
    });

  };



// function for setting the Plan.sortedCourses array in the view
  Plan.sortCourses = function(){

    if(angular.isDefined(Plan.selectedCourse)){
      Plan.sortedCourses = Plan.setTopic(Plan.selectedCourse);
    } else {
      Plan.sortedCourses = Plan.courses;
    }

    // removes level dropdown
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

    if(angular.isDefined(course.goals.goal.length)) {
      angular.forEach(course.goals.goal, function (goal) {
        if (Plan.checkList[goal.id].length == 1) {
          delete Plan.checkList[goal.id];
        } else {
          var index = Plan.checkList[goal.id].indexOf(course.id);
          Plan.checkList[goal.id].splice(index, 1);
        }
      });
    } else{
      if (Plan.checkList[course.goals.goal.id].length == 1) {
        delete Plan.checkList[course.goals.goal.id];
      } else {
        var index = Plan.checkList[course.goals.goal.id].indexOf(course.id);
        Plan.checkList[course.goals.goal.id].splice(index, 1);
      }
    }
    setAllChecks();
    Plan.updatePlanner();
  };

  // helperfunction takes goal.id and scope and sets Plan.popoverGoals array with all matching courses as [{topic-name, course-name}, ...]
  Plan.setPopoverGoals = function(id, scope){
    // empty popover array
    Plan.popoverGoals = [];

    // loop through topics
    angular.forEach(Plan.topics, function(topic){
      //checks if topic.courses is array or object
      if(angular.isDefined(topic.courses.length)) {
        angular.forEach(topic.courses, function (course) {

          //checks if coursegoal.goal is array or object
          if(angular.isDefined(course.goals.goal.length)) {
            angular.forEach(course.goals.goal, function(goal){
              if (goal.id == id && goal.scope.search(scope) != -1) {
                var obj = {
                  topic: topic.value,
                  course: course.value
                };
                Plan.popoverGoals.push(obj);
              }
            });
          } else{
            if (course.goals.goal.id == id && course.goals.goal.scope.search(scope) != -1) {
              var obj = {
                topic: topic.value,
                course: course.value
              };
              Plan.popoverGoals.push(obj);
            }
          }
        });
      } else {
        //checks if coursegoal.goal is array or object
        if(angular.isDefined(course.goals.goal.length)) {
          angular.forEach(topic.courses.course.goals.goal, function (goal) {
            if (goal.id == id && goal.scope.search(scope) != -1) {
              var obj = {
                topic: topic.value,
                course: topic.courses.course.value
              };
              Plan.popoverGoals.push(obj);
            }
          });
        } else{
          if (course.goals.goal.id == id && course.goals.goal.scope.search(scope) != -1) {
            var obj = {
              topic: topic.value,
              course: topic.courses.course.value
            };
            Plan.popoverGoals.push(obj);
          }
        }
      }
    });
  };

  // helperfunction takes course.id and returns course topic
  Plan.getTopic = function(id){
    var courseTopic = '';
    angular.forEach(Plan.topics, function(topic){
      //checks if topic.courses is array or object
      if(angular.isDefined(topic.courses.length)) {
        angular.forEach(topic.courses, function (course) {
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

  // function for updating the user's planner with the data selected in the UI
  Plan.updatePlanner = function(newTitle){
    // get current planner content
    var plannerContent = angular.fromJson(Plan.current.content);
    var updatedCourses = [];
    var updatedData = [];
    var objectID = $routeParams.id;

    // sets up selected courses
    angular.forEach(Plan.selected, function(course){
      // push course id to courses array
      updatedCourses.push(course.id);
    // set up and push data object for selected course

      // goal cell init
      //var goals = "Undervisningen i forløbet skal lede frem mod, at eleverne har tilegnet sig kundskaber og færdigheder, der sætter dem i stand til at<br><br>";
      var goals = "";
      // loop through all course goals at present goal title in <b> tags and goal scopes as <ul>

      var goalCategory = '';

      //checks if coursegoal.goal is array or object
      if(angular.isDefined(course.goals.goal.length)) {
        angular.forEach(course.goals.goal, function (goal) {

          var currentCategory = Plan.getGoalCategory(goal.id).value;

          var newGoalData = Plan.getGoal(goal.id);
          // ignore following if Plan.getGoal(goal.id) is empty
          // this could be caused by error in data feed
          if(newGoalData) {
            // check if current goal category differs from the last. if so add category as header
            if(currentCategory != goalCategory){
              goalCategory = currentCategory;
              goals += "<h3>" + currentCategory + "</h3>";
            }

            goals += "<b>" + newGoalData.value + "</b><ul>";
            // checks for instance where goal.faser.fase is an object and not an array
            if (angular.isUndefined(newGoalData.faser.fase.length)) {

              goals += "<li>" + newGoalData.faser.fase.faerdighedsmaal + "</li>";
              // GOAL VIDESMAAL COULD BE ADDED HERE...
              goals += "<li>" + newGoalData.faser.fase.vidensmaal + "</li>";

            } else {
              // checks for scope matches before adding sub goals
              if (goal.scope.search('1') != -1) {
                goals += "<li>" + newGoalData.faser.fase[0].faerdighedsmaal + "</li>";
                // GOAL VIDESMAAL COULD BE ADDED HERE...
                goals += "<li>" + newGoalData.faser.fase[0].vidensmaal + "</li>";

                //newGoalData.faser.fase[0].vidensmaal
              }
              if (goal.scope.search('2') != -1) {
                goals += "<li>" + newGoalData.faser.fase[1].faerdighedsmaal + "</li>";
                // GOAL VIDESMAAL COULD BE ADDED HERE...
                goals += "<li>" + newGoalData.faser.fase[1].vidensmaal + "</li>";

                //newGoalData.faser.fase[1].vidensmaal
              }
              if (goal.scope.search('3') != -1) {
                goals += "<li>" + newGoalData.faser.fase[2].faerdighedsmaal + "</li>";
                // GOAL VIDESMAAL COULD BE ADDED HERE...
                goals += "<li>" + newGoalData.faser.fase[2].vidensmaal + "</li>";

                //newGoalData.faser.fase[2].vidensmaal
              }
            }
            goals += "</ul>";
          }
        });
      } else {
        var currentCategory = Plan.getGoalCategory(course.goals.goal.id).value;

        var newGoalData = Plan.getGoal(course.goals.goal.id);

        // ignore following if Plan.getGoal(goal.id) is empty
        // this could be caused by error in data feed
        if(newGoalData) {

          // check if current goal category differs from the last. if so add category as header
          if(currentCategory != goalCategory){
            goalCategory = currentCategory;
            goals += "<h3>" + currentCategory + "</h3>";
          }

          goals += "<b>" + newGoalData.value + "</b><ul>";
          // checks for instance where goal.faser.fase is an object and not an array
          if (angular.isUndefined(newGoalData.faser.fase.length)) {

            goals += "<li>" + newGoalData.faser.fase.faerdighedsmaal + "</li>";
            // GOAL VIDESMAAL COULD BE ADDED HERE...
            goals += "<li>" + newGoalData.faser.fase.vidensmaal + "</li>";

          } else {
            // checks for scope matches before adding sub goals
            if (course.goals.goal.scope.search('1') != -1) {
              goals += "<li>" + newGoalData.faser.fase[0].faerdighedsmaal + "</li>";
              // GOAL VIDESMAAL COULD BE ADDED HERE...
              goals += "<li>" + newGoalData.faser.fase[0].vidensmaal + "</li>";
            }
            if (course.goals.goal.scope.search('2') != -1) {
              goals += "<li>" + newGoalData.faser.fase[1].faerdighedsmaal + "</li>";
              // GOAL VIDESMAAL COULD BE ADDED HERE...
              goals += "<li>" + newGoalData.faser.fase[1].vidensmaal + "</li>";
            }
            if (course.goals.goal.scope.search('3') != -1) {
              goals += "<li>" + newGoalData.faser.fase[2].faerdighedsmaal + "</li>";
              // GOAL VIDESMAAL COULD BE ADDED HERE...
              goals += "<li>" + newGoalData.faser.fase[2].vidensmaal + "</li>";
            }
          }
          goals += "</ul>";
        }
      }

      var data = {
        'forloeb': Plan.getTopic(course.id).value+"<br><b>"+course.value+"</b>", // temperarily removes "lektioner" fra course data:  <br><i style='font-size:0.8em;'>"+course.duration+"</i>",
        'maal': goals
      };
      updatedData.push(data);

    });
    plannerContent.courses = updatedCourses;
    plannerContent.data = updatedData;

    // set Plan.current to updated planner data
    Plan.current.content = angular.toJson(plannerContent);
    $rootScope.current.content  = angular.toJson(plannerContent);

    // set Plan.current to updated planner newTitle if available
    if(newTitle) {
      Plan.current.title = newTitle;
      $rootScope.current.title = newTitle;
      $rootScope.dialog = '';
    }
    getdataservice.updateOrganizer(Plan.current, objectID).then(function(data){
    });
  };

// ----------  Drag and drop functionality ------
  Plan.dropSuccessHandler = function($event,index,course,array){

  };

  Plan.onDrop = function($event,$data,array){

        var duplicate = false;
        angular.forEach(array, function(elem){
          if(elem.id == $data.id){
            duplicate = true;
          }
        });
        if(duplicate == false){
          array.push($data);
          // update planner content on drop success
          Plan.updatePlanner();

          // set checkmark on all instances of selected course, and its goals
          // loop all courses to find course with matching id
          angular.forEach(array, function(aCourse){
            // when match, add course.id and all course goals id and scope to checkList. Goals as array with course.id
            if(aCourse.id == $data.id){
              Plan.checkList[$data.id] = true;
              //checks if coursegoal.goal is array or object
              if(angular.isDefined($data.goals.goal.length)) {
                angular.forEach($data.goals.goal, function (goal) {

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

                  var tempobejct = {};
                  tempobejct[$data.id] = scopes;

                  // initialize new array at Plan.checkList[goal.id] if it doesn't exist already
                  if (angular.isDefined(Plan.checkList[goal.id])) {

                    Plan.checkList[goal.id].push(tempobejct);
                  } else {
                    Plan.checkList[goal.id] = [];
                    Plan.checkList[goal.id].push(tempobejct);
                  }
                });
              } else{
                // parse and store goal scope
                var scopes = {};
                var tempScope = $data.goals.goal.scope;
                // set up regexp to find numbers in 'levels' string
                var regexp = "[0-9]+";
                var re = new RegExp(regexp, "i");

                // find and replace
                while (tempScope.search(re) != -1) {
                  var currentScope = re.exec(tempScope)[0];
                  scopes[currentScope] = true;
                  tempScope = tempScope.replace(currentScope, '');
                }

                var tempobejct = {};
                tempobejct[$data.id] = scopes;

                // initialize new array at Plan.checkList[goal.id] if it doesn't exist already
                if (angular.isDefined(Plan.checkList[$data.goals.goal.id])) {

                  Plan.checkList[$data.goals.goal.id].push(tempobejct);
                } else {
                  Plan.checkList[$data.goals.goal.id] = [];
                  Plan.checkList[$data.goals.goal.id].push(tempobejct);
                }
              }
            }
          });
          // re-sort sorted course list to update view
          Plan.sortCourses();

          // set all check values
          setAllChecks();
        }

  };

  Plan.drag = function($event,$data,array){
    //array.push($data);
    hidePopover();
  };


  // function for determining whether a popover window is cut off by window bottom
  // and calculate the offset to counter act through ng-style.
  // Takes an mouseover event (e) and a pixel threshold as int (limit) for when to recalculate the offset.
  Plan.setPopoverPos = function(e, limit){
    var offset = (e.y + 225) - window.innerHeight;

    if(offset > 0){
      if(Math.abs(offset + $rootScope.popset) > limit ){
        $rootScope.popset = -offset;
      }
    }else{
      $rootScope.popset = 0;

    }
  }
}]);