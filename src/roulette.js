(function() {
    'use strict';

    angular
		.module('roulette', [])
        .directive('roulette', infiniteScroll);

    function infiniteScroll ($window, $timeout, $document) {
        var directive = {
            scope: {
                roulette:'&',
                scrollingContainer:'='
            },
            link: link,
            restrict: 'A'
        };
        return directive;

		function link(scope, element, attr) {
		    var scrollIt = function () {

				$window = angular.element($window);
				$document = angular.element($document);

				var lengthThreshold = attr.scrollThreshold || 50,
					timeThreshold = attr.timeThreshold || 400,
					promise = null,
					lastRemaining = 9999;

				lengthThreshold = parseInt(lengthThreshold, 10);
				timeThreshold = parseInt(timeThreshold, 10);

				var container = null;
				if (scope.scrollingContainer == 'window')
				{
				    container = $window;
				}
                else if(scope.scrollingContainer){
				    container = angular.element(document.getElementById(scope.scrollingContainer));
				}
				else {
				    container =element;
				}

				var handler = function () {

				    var containerBottom = (container[0].scrollHeight - container[0].scrollTop) - container[0].clientHeight;
				    var shouldScroll = containerBottom <= lengthThreshold;

				    if (shouldScroll) {
				        if (promise !== null) {
				            $timeout.cancel(promise);
				        }
				        promise = $timeout(function () {
				            scope.$apply(scope.roulette);
				            promise = null;
				        }, timeThreshold);
				    }
				};

				container.off('scroll', handler);

				container.on('scroll', handler);
				scope.$on('$destroy', function () {
				    return container.off('scroll', handler);
				});
		    }

			scope.$watch('scrollingContainer', function (value) {
			    scrollIt();
			});
        }
    }

})();