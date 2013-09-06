'use strict';

var textspin = angular.module('textspin', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
            $routeProvider
              .when('/', {templateUrl: 'views/main.html', controller: 'IndexCtrl'})
              .when('/s/:spinText/:spinArms/:spinSpeed', {templateUrl: 'views/main.html', controller: 'IndexCtrl'});
        }]);

textspin.controller('IndexCtrl', function() {
  // LOL
});
