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
		    var elem = element;
		    var scrollIt = function () {

				$window = angular.element($window);
				$document = angular.element($document);

				var lengthThreshold = attr.scrollThreshold || 50,
					timeThreshold = attr.timeThreshold || 400,
					promise = null,
					lastRemaining = 9999;

				lengthThreshold = parseInt(lengthThreshold, 10);
				timeThreshold = parseInt(timeThreshold, 10);

				if (scope.scrollingContainer) {
				    elem = angular.element(document.getElementById(scope.scrollingContainer));
				    if (!elem || !elem[0]) {
				        elem = element;
				    }
				}
				
				var handler = function () {

				    var remaining = (elem[0].clientHeight - elem[0].scrollTop) - $window[0].outerHeight;
					var shouldScroll = remaining < lengthThreshold && (remaining - lastRemaining) < 0;
					//if we have reached the threshold and we scroll down
					if (shouldScroll) {
						//if there is already a timer running which has no expired yet we have to cancel it and restart the timer
						if (promise !== null) {
							$timeout.cancel(promise);
						}
						promise = $timeout(function () {
						    scope.$apply(scope.roulette);
							promise = null;
						}, timeThreshold);
					}
					lastRemaining = remaining;
				};

		        elem.off('scroll', handler);

				elem.on('scroll', handler);
				scope.$on('$destroy', function() {
				    return elem.off('scroll', handler);
				});
			}

			scope.$watch('scrollingContainer', function (value) {
			    scrollIt();
			});
        }
    }

})();