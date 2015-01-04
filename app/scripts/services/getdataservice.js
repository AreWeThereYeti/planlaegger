angular.module('gyldendal.services', [])
		.factory('getdataservice', ['$http', '$location', '$rootScope', function($http, $location, $rootScope) {
			var sdo= {

        getAllOrganizers: function(){
          var userID = 'mort088k'; // hardcoded userID for testing
          var returndata;

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

          //Needs userID
          var UserID = 'mort088k';

          var returndata;

          var request = {
            "organizer": {
              "userID":   UserID,
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

          var promise = $http.get('testjson/geografi7-9.json')

            .success(function (data, status, headers, config) {

            });

          return promise;
        },
        getPlannerList: function() {

          var promise = $http.get('testjson/getList.json')

            .success(function (data, status, headers, config) {

            });

          return promise;
        }


			};

			return sdo
		}]);