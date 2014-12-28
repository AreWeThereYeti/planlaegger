angular.module('gyldendal.directives')
	.directive('datePicker',[function() {
		return {
			restrict: 'EA',
			scope : true,
			templateUrl: 'scripts/templates/datepicker.html',
			controller : 'DatePickerCtrl',
			replace: true, // Replace with the template below
			link: function(scope, element, attrs) {
				element.bind('click', function(element){
					scope.$apply();
				});
        scope.$watch('valgtLaeremiddel',function(newVal,oldVal){
          if(angular.isDefined(newVal)) {
            scope.niveau = scope.subjectAsKeys[newVal];
          }
        });
        scope.$watch('valgtNiveau',function(newVal,oldVal){
          if(angular.isDefined(newVal)) {
            angular.forEach(scope.niveau, function(planner){
              if(newVal == planner.Level){
                scope.selectedPlannerID = planner.ID;
              }
            });
          }
        })
			}
		};
	}]);