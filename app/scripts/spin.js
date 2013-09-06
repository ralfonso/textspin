'use strict';

textspin.controller('SpinCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$window',
    function($scope, $routeParams, $location, $timeout, $window) {
        var defaultSpeed = 50;
        var defaultArms = 9;
        var randomLols = ['DUCKTALES',
                          'LOADING, LOL',
                          'SPINNING, LOL',
                          'LOL, LOL',
                          'LOLOLOLOLOLOLOLOL',
                          'LOL11!1!!!one',
                          'SPINNAZ',
                          'SHIRAZ',
                          'DOLF LUNDGRINNED',
                          'NFL FOOTBALL',
                          'MEOW MEOW MEOW',
                          'INTERNET!',
                          'GREAT DEFENSE!',
                          '123456789',
                          'C.R.E.A.M.',
                          'EPIC BEARD',
                          'PUBLIC MILK',
                          'POKOENCEPHELON',
                          ':)))))))>><><>@<>@<--()----'];
        $scope.spinner = {};

        var init = function() {
            var spinText = $routeParams.spinText;
            var spinArms = $routeParams.spinArms;
            var spinSpeed = $routeParams.spinSpeed;

            $scope.spinner.text = spinText ? Base64.decode(spinText) : _.first(_.shuffle(randomLols));
            $scope.spinner.arms = spinArms ? parseInt(Base64.decode(spinArms), 10) : defaultArms;
            $scope.spinner.speed = spinArms ? parseInt(Base64.decode(spinSpeed), 10) : defaultSpeed;

            if (!_.isNumber($scope.spinner.arms) || _.isNaN($scope.spinner.arms)) {
                $scope.spinner.arms = defaultArms;
            }

            if (!_.isNumber($scope.spinner.speed) || _.isNaN($scope.spinner.speed)) {
                $scope.spinner.speed = defaultSpeed;
            }

            $scope.spinner.armsList = _.range(0, $scope.spinner.arms);
            if (spinText && spinArms) {
                $scope.url = $window.location;
            }
        };

        var convertSpeed = function(speed) {
            var minSpeed = 1;
            var maxSpeed = 100;
            var minVal = Math.log(12000);
            var maxVal = Math.log(500);
            var scale = (maxVal - minVal) / (maxSpeed - minSpeed);
            return Math.floor(Math.exp(minVal + scale * (speed - minSpeed)));
        };

        $scope.craft = function() {
            var b64Text = Base64.encode($scope.spinner.text);
            var b64Arms = Base64.encode($scope.spinner.arms.toString());
            var b64Speed = Base64.encode($scope.spinner.speed.toString());
            $location.path('/s/' + [b64Text, b64Arms, b64Speed].join('/'));
        };

        $scope.armStyle = function(index) {
            var div = 360 / $scope.spinner.arms;
            var rotStart = div * index;
            var rotStop = rotStart + 360;
            var rotStartFloor = Math.floor(rotStart);
            var speed = convertSpeed($scope.spinner.speed);
            console.log('index: ' + index + ' start: ' + rotStart + ' stop: ' + rotStop + ' speed:' + speed);

            return {'animation': 'Rotate' + rotStartFloor + ' ' + speed + 'ms infinite linear'};
        };

        var redraw = function() {
            $scope.spinner.armsList = [];

            // FIXME: forgive me for doing it this way, but we need
            // a redraw of the elements so the animations restart
            $timeout(function() {

                // FIXME: this introduces a race condition
                if (_.isUndefined($scope.spinner.speed) || _.isNaN($scope.spinner.speed)) {
                    return;
                }

                $scope.spinner.armsList = _.range(0, $scope.spinner.arms);
            }, 100);

        };

        $scope.$watch('spinner.arms', redraw);
        $scope.$watch('spinner.speed', redraw);

        init();
    }
]);
