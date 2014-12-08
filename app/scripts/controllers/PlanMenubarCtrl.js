"use strict";

app.controller('PlanMenubarCtrl', ['$routeParams', 'getdataservice', '$rootScope', '$scope', '$location', function ($routeParams, getdataservice, $rootScope, $scope, $location) {
  //Save reference to controller in order to avoid reference soup
  var PlanMenubar = this;

  PlanMenubar.exportPlan = function () {
    if($rootScope.dialog == 'export plan'){
      $rootScope.dialog = '';
    }
    else{
      $rootScope.dialog = 'export plan';
    }
  };


}]);