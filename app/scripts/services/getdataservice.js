angular.module('gyldendal.services', [])
		.factory('getdataservice', ['$http', '$location', '$rootScope', function($http, $location, $rootScope) {
			var sdo= {

        getAllOrganizers: function(){

          //finds userID in url
          if(angular.isDefined($location.search().userID) && $location.search().userID != null){
            localStorage.userID =  $location.search().userID;
          }


          var userID = 'mort088k'; // hardcoded userID for testing

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'GET',
            url: 'php/getOrganizers.php?userID=' + userID /*+ $location.search().userID <-- --- --- ComponentID er lige nu hardcoded. Skal hentes fra URL*/
          })
            .success(function (data, status, headers, config) {
              if (data) {
                //console.log(data);


              }else{
               // console.log("error on organizer data request. component data has not been loaded");
              }
            });

          return promise;
        },
        getOrganizer: function(params){

          var objectID = params.id ;

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'GET',
            url: 'php/getOrganizer.php?objectID=' + objectID /*+ $location.search().userID <-- --- --- ComponentID er lige nu hardcoded. Skal hentes fra URL*/
          })
            .success(function (data, status, headers, config) {
              if (data) {
                //console.log(data);


              }else{
                //console.log("error on organizer data request. component data has not been loaded");
              }
            });

          return promise;
        },
        deleteOrganizer: function(plannerID) {



          var request = {
            "objectID": plannerID
          };

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            url: 'php/deleteOrganizer.php',
            data: angular.toJson(request)
          })
            .success(function (data, status, headers, config) {

            })
            .error(function(error){

            });

          return promise;
        },
        updateOrganizer: function(plannerInfo, objectID) {


          var request = {
            "objectID": objectID,
            "organizer": {
              "title":    plannerInfo.title,
              "subjects": plannerInfo.subjects,
              "levels":   plannerInfo.levels,
              "content":  plannerInfo.content
            }
          };

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            url: 'php/updateOrganizer.php',
            data: angular.toJson(request)
          })
            .success(function (data, status, headers, config) {
              if (data !== null) {
              }
            })
            .error(function(error){

            });

          return promise;
        },
        addOrganizer: function(plannerInfo) {
          // hardcoded userID for testing
          var userID = 'mort088k'; // localStorage.userID

          var returndata;

          var request = {
            "organizer": {
              "userID":   userID,
              "title":    plannerInfo.title,
              "subjects": plannerInfo.subjects,
              "levels":   plannerInfo.levels,
              "content":  angular.toJson(plannerInfo.content),
              "version": 2
            }
          };

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            url: 'php/addOrganizer.php',
            data: angular.toJson(request)
          })
            .success(function (data, status, headers, config) {
              if (data !== null) {
                //console.log("response: "+JSON.stringify(data));
              }
            })
            .error(function(error){
              //console.log("err: "+JSON.stringify(error));

            });

          return promise;
        },
        getPlanner: function(plannerID) {

          // uses local json list for development
          var promise = $http.get('testjson/geografi7-9.json')  // $http.get('http://test.plannerservice.gyldendal.dk/api/planner/get/plannerID')

            .success(function (data, status, headers, config) {

            });

          return promise;
        },
        getPlannerList: function() {

          // uses local json list for development
          var promise = $http.get('testjson/getList.json')   //  $http.get('http://test.plannerservice.gyldendal.dk/api/planner/getList')


            .success(function (data, status, headers, config) {

            });

          return promise;
        }


			};

			return sdo
		}]);