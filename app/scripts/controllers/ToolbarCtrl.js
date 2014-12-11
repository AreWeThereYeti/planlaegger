"use strict";

app.controller('ToolbarCtrl', ['$scope', function ($scope) {
  //Save reference to controller in order to avoid reference soup
  var Toolbar = this;


  Toolbar.clearAll = function(){

    angular.forEach($scope.$parent.Plan.plandata.planlaegger.kompetenceomraader.kompetenceomraade, function(omraade){
      angular.forEach(omraade.faerdighedsOgVidensmaalPLURALIS.faerdighedsOgvidensmaalSINGULARIS, function(vidensmaal){
        vidensmaal.Selected = false;
        if(vidensmaal.faser.fase.length) {
          angular.forEach(vidensmaal.faser.fase, function (fase) {
            fase.Selected = false;
          });
        }
      });
    });
    angular.forEach($scope.$parent.Plan.courses, function(course){
      course.highlight = false;
    });
    $scope.$parent.Plan.highlighted = {};
  };


  //Test variable. If you see it when the app runs you are good to go
  Toolbar.testVar = 'This is data from the menubar!';
}]);