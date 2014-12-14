<?php
include('php/core.php');

?>

<!--//
//	include('php/user-auth.php');
//
//	//Initialize auth process
//	$authObj = new UserAuth();
//
//-->

<!doctype html>
<html lang="en" id="ng-app" ng-app="app" ng-cloak>
    <head>

    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

      <!--[if lt IE 9]>
        <script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/2.2.0/es5-shim.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/2.2.0/es5-sham.js"></script>

          <script>
            document.createElement('ng-include');
            document.createElement('ng-pluralize');
            document.createElement('ng-pluralize');
          </script>

      <![endif]-->



      <script src="scripts/libs/angular.min.js"></script>

      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="viewport" content="width=device-width, maximum-scale=1.0" />
      <title ng-bind="$root.title"></title>

      <script src="//use.typekit.net/ldl1xnu.js"></script>
      <script>try{Typekit.load();}catch(e){}</script>


      <link rel="stylesheet" href="styles/main.css" />
      <link rel="stylesheet" href="styles/ionicons.min.css" />




    </head>
    <body ng-controller="MainCtrl as Main">

<!--    <div class="topheader">
      <h1><span class="gyldendal">Gyldendal |</span> <span class="ilog">I-log</span></h1>
    </div>-->

      <!--Spinner-->
      <div ng-show="$root.loadingView == true" class="spinner-backdrop">

        <div us-spinner="{radius:25, width:2, length: 6, lines: 20}">

        </div>
      </div>

      <!-- NG-view is where your view is served via the routes setup in config.js-->
      <div ng-view=""></div>

      <!--libs-->
      <script src="scripts/libs/angular-resource.min.js"></script>
      <script src="scripts/libs/angular-route.min.js"></script>
      <script src="scripts/libs/angular-animate.min.js"></script>
      <script src="scripts/libs/spin.min.js"></script>
<script src="scripts/modules/nsPopover.js"></script>

      <!--config-->
      <script src="scripts/config.js"></script>

      <!--controllers-->
      <script src="scripts/controllers/OverviewCtrl.js"></script>
      <script src="scripts/controllers/MainCtrl.js"></script>
      <script src="scripts/controllers/PlanlaeggerCtrl.js"></script>
      <script src="scripts/controllers/PlanMenubarCtrl.js"></script>
      <script src="scripts/controllers/ToolbarCtrl.js"></script>



      <script src="scripts/controllers/DatePickerCtrl.js"></script>
      <script src="scripts/controllers/DialogCtrl.js"></script>

      <!--Component/template controllers-->
      <script src="scripts/controllers/MenubarCtrl.js"></script>
      <script src="scripts/controllers/FilterbarCtrl.js"></script>

      <!--services-->
      <script src="scripts/services/getdataservice.js"></script>
      <script src="scripts/services/dateservice.js"></script>

      <!--filters-->
      <script src="scripts/filters/logRangeFilter.js"></script>
      <script src="scripts/filters/reportRangeFilter.js"></script>


      <!--directives-->
      <script src="scripts/directives/dialog.js"></script>
      <script src="scripts/directives/datepicker.js"></script>
      <script src="scripts/directives/hideFilterDirective.js"></script>
      <script src="scripts/directives/globalCss.js"></script>
      <script src="scripts/directives/angular-spinner.min.js"></script>
      <script src="scripts/directives/draganddrop.js"></script>

      <script type="text/ng-template" id="course-popover">
        <div class="popover-container">
          <div class="popover-inner">
            <div class="popover-head">
              <h2>{{Plan.getTopic(course.id).value}}</h2>
              <h3 class="popover-course">{{course.value}}</h3>
            </div>
            <div class="popover-content" ng-repeat="goal in course.goals.goal">
              <h3>{{Plan.getGoalCategory(goal.id).value}}</h3>
              <h3>{{Plan.getGoal(goal.id).value}}</h3>
              <ul>
                <li ng-show="goal.scope.search('1') != -1">
                  <span class="scope">{{Plan.getGoal(goal.id).faser.fase[0].scope}}</span>
                  <span>{{Plan.getGoal(goal.id).faser.fase[0].faerdighedsmaal}}. {{Plan.getGoal(goal.id).faser.fase[0].vidensmaal}}</span>
                </li>
                <li ng-show="goal.scope.search('2') != -1">
                  <span class="scope">{{Plan.getGoal(goal.id).faser.fase[1].scope}}</span>
                  <span>{{Plan.getGoal(goal.id).faser.fase[1].faerdighedsmaal}}. {{Plan.getGoal(goal.id).faser.fase[1].vidensmaal}}</span>
                </li>
                <li ng-show="goal.scope.search('3') != -1">
                  <span class="scope">{{Plan.getGoal(goal.id).faser.fase[2].scope}}</span>
                  <span>{{Plan.getGoal(goal.id).faser.fase[2].faerdighedsmaal}}. {{Plan.getGoal(goal.id).faser.fase[2].vidensmaal}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </script>

      <script type="text/ng-template" id="goal-popover">
        <div class="popover-container">
          <div class="popover-inner">
            <div class="popover-head">
              <h2>{{elem.value}}</h2>
              <div>{{subelem.value}}</div>
              <div>Fase {{subsubelem.scope}}</div>
            </div>
            <div class="popover-content">
              <h3>Understøttede forløb:</h3>
              <div class="popover-goal" ng-repeat="course in Plan.popoverGoals">{{course.topic}}: {{course.course}}</div>
            </div>
          </div>
        </div>
      </script>
    </body>
</html>
