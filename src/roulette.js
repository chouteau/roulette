(function() {
    'use strict';

    angular
		.module('roulette', [])
        .directive('roulette', infiniteScroll);

    function infiniteScroll ($window, $timeout, $document) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

		function link(scope, element, attr) {

			var scrollIt = function() {
				$window = angular.element($window);
				$document = angular.element($document);

				var lengthThreshold = attr.scrollThreshold || 50,
					timeThreshold = attr.timeThreshold || 400,
					promise = null,
					lastRemaining = 9999;

				lengthThreshold = parseInt(lengthThreshold, 10);
				timeThreshold = parseInt(timeThreshold, 10);

				var handler = function () {

					var body = angular.element(document.getElementsByTagName('body')[0]);
					var remaining = (body[0].clientHeight - body[0].scrollTop) - $window[0].outerHeight;
					// console.log(remaining);
					var shouldScroll = remaining < lengthThreshold && (remaining - lastRemaining) < 0;
					//if we have reached the threshold and we scroll down
					if (shouldScroll) {
						//if there is already a timer running which has no expired yet we have to cancel it and restart the timer
						if (promise !== null) {
							$timeout.cancel(promise);
						}
						promise = $timeout(function () {
							scope.$eval(attr.infiniteScroll);
							promise = null;
						}, timeThreshold);
					}
					lastRemaining = remaining;
				};

		        $window.on('scroll', handler);
				scope.$on('$destroy', function() {
				  return $window.off('scroll', handler);
				});
			}

			angular.element($document).ready(function () {
				$timeout(scrollIt, 1 * 1000);
			});
        }

    }

})();