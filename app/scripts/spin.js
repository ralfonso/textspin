'use strict';

textspin.controller('SpinCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$window',
    function($scope, $routeParams, $location, $timeout, $window) {
        // set some default params and lols
        var defaultSpeed = 50;
        var defaultArms = 9;
        var randomLols = ['DUCKTALES',
                          'LOADING, LOL',
                          'SPINNING, LOL',
                          'LOL11!1!!!one',
                          'SPINNAZ',
                          'DOLF LUNDGRINNED',
                          'NFL FOOTBALL',
                          'MEOW MEOW MEOW',
                          'INTERNET!',
                          'GREAT DEFENSE!',
                          '123456789',
                          'DINNER AT ELWAY\'S',
                          'CHIPOTLE OBSESSION',
                          'STACY BURRITO',
                          'CHAMPAGNE BUTTON',
                          '--<()>--',
                          'SPINDERELLA',
                          'C.R.E.A.M.',
                          'EPIC BEARD',
                          'PUBLIC MILK',
                          'POKOENCEPHELON',
                          ':)))))))>><><>@<>@<--()----'];

        // initialize our spiner obj. we use an intermediate object
        // to allow properties to trickle down to inner scopes
        $scope.spinner = {};

        var init = function() {
            // attempt to load values from the b64 encoded url
            var spinText = $routeParams.spinText;
            var spinArms = $routeParams.spinArms;
            var spinSpeed = $routeParams.spinSpeed;

            // FIXME: there has to be a better way to parse/validate these
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
            // janky logarithmic scale to convert our user-friendly 1-100
            // scale to a millisecond delay for the CSS3 animation
            var minSpeed = 1;
            var maxSpeed = 100;
            var minVal = Math.log(12000);
            var maxVal = Math.log(500);
            var scale = (maxVal - minVal) / (maxSpeed - minSpeed);
            return Math.floor(Math.exp(minVal + scale * (speed - minSpeed)));
        };

        $scope.craft = function() {
            // b64 is for obfuscators. called when the save button is smashed
            var b64Text = Base64.encode($scope.spinner.text);
            var b64Arms = Base64.encode($scope.spinner.arms.toString());
            var b64Speed = Base64.encode($scope.spinner.speed.toString());
            $location.path('/s/' + [b64Text, b64Arms, b64Speed].join('/'));
        };

        $scope.armStyle = function(index) {
            // applies a css style to each arm of the spinner
            var div = 360 / $scope.spinner.arms;
            var rotStart = div * index;
            var rotStop = rotStart + 360;
            var rotStartFloor = Math.floor(rotStart);
            var speed = convertSpeed($scope.spinner.speed);
            console.log('index: ' + index + ' start: ' + rotStart + ' stop: ' + rotStop + ' speed:' + speed);

            return {'animation': 'Rotate' + rotStartFloor + ' ' + speed + 'ms infinite linear'};
        };

        var redraw = function() {
            // removes and redraws the spinner. abuses the fact that
            // the displayed spinner is actually driven by $scope.armsList,
            // not $scope.arms

            // FIXME: forgive me for doing it this way, but we need
            // a redraw of the elements so the animations restart
            $scope.spinner.armsList = [];

            $timeout(function() {
                // add a small delay and set the armsList, which will
                // cause the spinner to be redrawn

                // FIXME: this introduces a race condition
                if (_.isUndefined($scope.spinner.speed) || _.isNaN($scope.spinner.speed)) {
                    return;
                }

                $scope.spinner.armsList = _.range(0, $scope.spinner.arms);
            }, 100);

        };

        // FIXME: find a way to do this without explicit watches
        $scope.$watch('spinner.arms', redraw);
        $scope.$watch('spinner.speed', redraw);

        // I guess it's ok to initialize like this in angularjs
        init();
    }
]);
