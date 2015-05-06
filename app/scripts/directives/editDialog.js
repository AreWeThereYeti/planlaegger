'use strict';

angular.module('gyldendal.directives')
  .directive("editDialog", function($compile, $document){
    var contentContainer;
    return {
      restrict: "A",
      //scope: {
      //  tooltipScope: "=",
      //  tooltipIndex: "="
      //},
      link: function(scope, element, attrs){
        var templateUrl = attrs.tooltipIp;

        scope.hidden = true;
        scope.animate = false;

        //var tooltipElement = angular.element("<div ng-hide='hidden' ng-class='{animate: animate}' class='tooltip-container'>");
        //tooltipElement.append("<div class='tooltip' ng-include='\"" + templateUrl + "\"'></div>");
        //
        //tooltipElement
        //  .on('mouseenter', function(){
        //    scope.hidden = false;
        //    scope.$digest();
        //  } )
        //  .on('mouseleave', function(){
        //    scope.hidden = true;
        //    scope.$digest();
        //  });

        //var body = $document.find('body').eq(0);
        //body.append(tooltipElement);

        element
          .on('click', function(){
            document.getElementsByClassName('edit-dialog-container')[0].style.left = (element[0].getBoundingClientRect().left - 45) + "px";
            document.getElementsByClassName('edit-dialog-container')[0].style.display = "block";

            scope.animate = true;
            scope.hidden = false;
            scope.$digest();
          } );
        //scope.$on('$destroy', function(){
        //  var popup = document.getElementsByClassName('tooltip-container');
        //  if(angular.isDefined(popup)) {
        //    angular.forEach(popup, function(instance){
        //      instance.parentNode.removeChild(instance);
        //    });
        //  }
        //});
        //var toolTipScope = scope.$new(true);
        //angular.extend(toolTipScope, scope.tooltipScope);
        //$compile(tooltipElement.contents())(toolTipScope);
        //$compile(tooltipElement)(scope);
      }
    };

  });
