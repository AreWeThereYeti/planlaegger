"use strict";

app.controller('OverviewCtrl', [ '$timeout', 'entries', 'component', '$rootScope', '$location', 'getdataservice', '$scope', '$route', function ($timeout, entries, component, $rootScope, $location, getdataservice, $scope, $route) {

	//Save reference to controller in order to avoid reference soup
	var Overview = this;
  // intial active sort
  Overview.predicate = 'timestamp';
  Overview.reverse = false;

  // find logEntries in entry list
  if(angular.isDefinedOrNotNull(entries.data) && entries.data.length) {
    angular.forEach(entries.data, function (entry) {
      if (entry.componentSubType == null || entry.componentSubType == ""){
        Overview.logEntries = entry;
      }
    });
  }else {
    Overview.logEntries = "Not found";
  }

  Overview.componentData = angular.fromJson(component.data.Content);



  // check if there user has previous ilog entries
  if(Overview.logEntries == "Not found"){

    // Debugging

    // set ilog save method to "add"
    $rootScope.firstLogEntry = true;

    // go to ilog view
     $location.path('log');


  } else {

    // set save method to "update"
    $rootScope.firstLogEntry = false;

/*    // promt "no logs has been entered go to ilog view"
    if(angular.isUndefined($rootScope.introPrompt)){
      $timeout(function () {
        if (confirm("Gå direkte til indtastningssiden")) {
          $rootScope.introPrompt = false;
          $location.path('log');
        }
      },500);

    }*/
    $rootScope.introPrompt = false;

     // load logs into view
    Overview.logs = angular.fromJson(Overview.logEntries.content);
    for(var i = 0; i<Overview.logs.length; i++){
      Overview.logs[i].id = i;
    }




  }

  // recursive function for parsing a string on the form "a, b, c" to the array[a,b,c]
  Overview.parseElements = function(expr, array){
    if(expr.search(/\,/)!=-1){

      array.push($scope.$eval(expr.slice(0, expr.search(/\,/))));
      Overview.parseElements(expr.slice(expr.search(/\,/)+1, expr.length), array);
    } else if(expr.length){
      array.push($scope.$eval(expr.slice(0, expr.length)));
      expr = "";
    }
    return array;
  };

  // prepare list of input fields and values to display in log list
  var fields = [];
  Overview.parseElements(Overview.componentData.settings.listview, fields);
  Overview.listView = [];
  angular.forEach(Overview.componentData.inputs, function(logInput){
    angular.forEach(fields, function(field){
      if(logInput.id == field){
        if(angular.isDefined(logInput.unit)){
          Overview.listView.push({
            label: logInput.label,
            fieldID: logInput.id,
            type: logInput.type,
            unit: logInput.unit
          })
        } else {
          Overview.listView.push({
            label: logInput.label,
            fieldID: logInput.id,
            type: logInput.type,
            unit: ''
          })
        }
      }
    });
  });

  //Delete log
  Overview.deleteLog = function(logIndex){
    if (confirm('Er du sikker på du vil slette denne log?')) {
      var newLogs = angular.fromJson(Overview.logEntries.content);
      newLogs.splice(logIndex,1);
      if(newLogs.length){
        getdataservice.updateLog(newLogs, Overview.logEntries.objectID)
        .then(function(isDeleted){
          $route.reload()
        });
      } else {
        Overview.deleteAll();
      }

    }
  };

  //Delete all logs
  Overview.deleteAll = function(){
    if (confirm('Er du sikker på du vil slette alle logs?')) {
      getdataservice.deleteAllLogs(Overview.logEntries.objectID)
        .then(function(isDeleted){
          $location.path('/');
        });
    }
  };

  $scope.changeRange = function(range){
    Overview.filterRange = range;
  };

  Overview.computeCssClass = function(lastField){
    var cssClass = null;
    if(lastField){
      var fieldSize = 8-Overview.listView.length;
      if(fieldSize >= 3){
        cssClass = "col-"+(fieldSize-2)+"-8";

        return cssClass
      }
    } else if (Overview.listView.length==0){
      return "col-6-8"

    }
    return "col-1-8"
  };

  // function for replacing the '.' with ',' in listview values of type formula
  Overview.formatFloat = function(val){
    return val.toString().replace('.',',');
  };

	Overview.formatTime = function(seconds){
    // function for formating time value from seconds to formaat : hh, mm, ss, cs
    var newtimeformat = '';
    var theRest = seconds;

    var hh =  parseInt(theRest / 3600);
    theRest = theRest % 3600;
    if(hh){
      newtimeformat += hh+" t. ";
    }

    var mm =  parseInt(theRest / 60);
    theRest = theRest % 60;
    if(mm){
      newtimeformat += mm+" m. ";
    }

    var ss =  parseInt(theRest);
    theRest = theRest - ss;
    if(ss){
      newtimeformat += ss+" s. ";
    }

    var cs = Math.round(theRest*100);
    if(cs){
      newtimeformat += cs+" cs.";
    }

    return newtimeformat

  }

}]);